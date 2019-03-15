import {DrData} from './dr-data';
import {Haltestelle, HaltestelleJson} from './haltestelle';
import {QuadTree} from '../quadtree/quad-tree';
import {Zone} from './zone';
import {PolygonMerger} from '../geo/polygon-merger';
import {MultiPolygon2d} from '../geo/multi-polygon-2d';
import {Polygon2d} from '../geo/polygon-2d';
import {Lokalnetz} from './lokalnetz';
import {Interbereich, InterbereichJson} from './interbereich';
import {Extent2d} from '../geo/extent-2d';
import {VoronoiHelper} from '../geo/voronoi-helper';
import {StringMap} from '../shared/string-map';
import {ZoneLikeJson} from './zonelike';
import {Kante} from './kante';


class KanteWithZonen {
    constructor(
        public kante: Kante,
        public zonen: Zone[]
    ) {}
}


export class PrecalcHelper {
    private constructor() {}


    public static precalc(drData: DrData): QuadTree<Haltestelle> {
        console.log('creating LUTs...');
        this.createKantenLut(drData);
        this.createZonenLut(drData);
        this.createZonenplanLut(drData);
        console.log('creating LUTs completed');

        console.log('creating hst quad tree...');
        const hstQuadTree = this.createHstQuadTree(drData.haltestellen);
        console.log('creating hst quad tree completed');

        console.log('calculating voronoi...');
        this.calcVoronoi(drData.haltestellen);
        console.log('calculating voronoi completed');

        console.log('calculating polygons...');
        this.calcZonePolygons(drData.zonen);
        this.calcLokalnetzPolygons(drData.lokalnetze);
        this.calcInterbereichPolygons(drData.interbereiche);
        console.log('calculating polygons completed');


        return hstQuadTree;
    }


    private static createKantenLut(drData: DrData) {
        drData.kanten.forEach(kante => {
            kante.haltestelle1.kantenLut.push(kante);
            kante.haltestelle2.kantenLut.push(kante);
        });
    }


    private static createZonenLut(drData: DrData) {
        drData.zonen.forEach(zone => {
            zone.kanten.forEach(kante => kante.zonenLut.push(zone));
        });
    }


    private static createZonenplanLut(drData: DrData) {
        drData.zonenplaene.forEach(zonenplan => {
            zonenplan.zonen.forEach(zone => zone.zonenplan = zonenplan);
            zonenplan.lokalnetze.forEach(lokalnetz => lokalnetz.zonenplan = zonenplan);
        });
    }

    private static createHstQuadTree(hstMap: StringMap<Haltestelle, HaltestelleJson>): QuadTree<Haltestelle> {
        const extent = new Extent2d(5, 45, 15, 50); // TODO
        const quadTree = new QuadTree<Haltestelle>(extent, 10); // TODO

        hstMap.forEach(hst => quadTree.addItem(hst));

        return quadTree;
    }


    private static calcVoronoi(hstMap: StringMap<Haltestelle, HaltestelleJson>) {
        const hstList = Array.from(hstMap.values())
            .filter(hst => hst.isActive());

        VoronoiHelper.calculate(hstList);
    }


    private static calcZonePolygons(zoneMap: StringMap<Zone, ZoneLikeJson>) {
        const zoneHstMap = new Map<Zone, Haltestelle[]>();
        const zoneList = Array.from(zoneMap.values());

        // first pass: kanten with 1 assigned zone
        zoneList.forEach(zone => {
            const hstList: Haltestelle[] = [];
            this.getKantenLinkedToNOtherZonen(zone, 0)
                .map(kantZon => kantZon.kante)
                .forEach(kante => this.addUniqueKantenHst(hstList, kante));
            zoneHstMap.set(zone, hstList);
        });


        // second pass: kanten with 2 assigned zonen
        zoneList.forEach(zone => {
            this.getKantenLinkedToNOtherZonen(zone, 1)
                .forEach(kantZon => {
                    const zone1HstList = zoneHstMap.get(zone);
                    const zone2HstList = zoneHstMap.get(kantZon.zonen[0]);
                    const hst1InZone1 = zone1HstList.indexOf(kantZon.kante.haltestelle1) >= 0;
                    const hst1InZone2 = zone2HstList.indexOf(kantZon.kante.haltestelle1) >= 0;
                    const hst2InZone1 = zone1HstList.indexOf(kantZon.kante.haltestelle2) >= 0;
                    const hst2InZone2 = zone2HstList.indexOf(kantZon.kante.haltestelle2) >= 0;
                    const hst1InAnyZone = hst1InZone1 || hst1InZone2;
                    const hst2InAnyZone = hst2InZone1 || hst2InZone2;

                    if (hst1InZone1 && !hst2InAnyZone) {
                        this.addUniqueHst(zone2HstList, kantZon.kante.haltestelle2);
                    }

                    if (hst2InZone1 && !hst1InAnyZone) {
                        this.addUniqueHst(zone2HstList, kantZon.kante.haltestelle1);
                    }

                    if (hst1InZone2 && !hst2InAnyZone) {
                        this.addUniqueHst(zone1HstList, kantZon.kante.haltestelle2);
                    }

                    if (hst2InZone2 && !hst1InAnyZone) {
                        this.addUniqueHst(zone1HstList, kantZon.kante.haltestelle1);
                    }
                });
        });


        // union polygons
        zoneList.forEach(zone => {
            const hstList = zoneHstMap.get(zone);
            if (hstList.length > 0) {
                zone.polygon = PolygonMerger.unionAdjacentRings(hstList.map(hst => hst.ring));
                zone.hstPolygon = new MultiPolygon2d(hstList.map(hst => new Polygon2d(hst.ring)));
            }
        });
    }


    private static calcLokalnetzPolygons(lokalnetzMap: StringMap<Lokalnetz, ZoneLikeJson>) {
        const lokalnetzList = Array.from(lokalnetzMap.values());

        lokalnetzList.forEach(lokalnetz => {
            const hstList: Haltestelle[] = [];
            lokalnetz.kanten.forEach(kante => this.addUniqueKantenHst(hstList, kante));

            if (hstList.length > 0) {
                lokalnetz.polygon = PolygonMerger.unionAdjacentRings(hstList.map(hst => hst.ring));
                lokalnetz.hstPolygon = new MultiPolygon2d(hstList.map(hst => new Polygon2d(hst.ring)));
            }
        });
    }


    private static calcInterbereichPolygons(interbereichMap: StringMap<Interbereich, InterbereichJson>) {
        const interbereichList = Array.from(interbereichMap.values());

        interbereichList.forEach(interbereich => {
            const hstList: Haltestelle[] = [];
            interbereich.kanten.forEach(kante => this.addUniqueKantenHst(hstList, kante));

            if (hstList.length > 0) {
                interbereich.polygon = PolygonMerger.unionAdjacentRings(hstList.map(hst => hst.ring));
                interbereich.hstPolygon = new MultiPolygon2d(hstList.map(hst => new Polygon2d(hst.ring)));
            }
        });
    }


    private static addUniqueKantenHst(hstList: Haltestelle[], kante: Kante) {
        this.addUniqueHst(hstList, kante.haltestelle1);
        this.addUniqueHst(hstList, kante.haltestelle2);
    }


    private static addUniqueHst(hstList: Haltestelle[], hst: Haltestelle) {
        if (hstList.indexOf(hst) === -1) {
            hstList.push(hst);
        }
    }


    private static getKantenLinkedToNOtherZonen(zone: Zone, otherZoneCount: number): KanteWithZonen[] {
        return zone.kanten
            .map(kante => new KanteWithZonen(kante, this.getLinkedOtherZonen(kante, zone)))
            .filter(kanteWZonen => kanteWZonen.zonen.length === otherZoneCount);
    }


    private static getLinkedOtherZonen(kante: Kante, zone: Zone): Zone[] {
        return kante.zonenLut
            .filter(otherZone => otherZone !== zone && zone.zonenplan.zonen.indexOf(otherZone) >= 0);
    }
}
