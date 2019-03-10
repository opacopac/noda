import {DrData} from './dr-data';
import {Haltestelle, HaltestelleJson} from './haltestelle';
import {QuadTree} from '../quadtree/quad-tree';
import {Zone} from './zone';
import {HstKanteZoneHelper} from './hst-kante-zone-helper';
import {PolygonMerger} from '../geo/polygon-merger';
import {MultiPolygon2d} from '../geo/multi-polygon-2d';
import {Polygon2d} from '../geo/polygon-2d';
import {Lokalnetz} from './lokalnetz';
import {Interbereich, InterbereichJson} from './interbereich';
import {Extent2d} from '../geo/extent-2d';
import {VerkehrsmittelTyp} from './kante';
import {VoronoiHelper} from '../geo/voronoi-helper';
import {StringMap} from '../shared/string-map';
import {ZoneLikeJson} from './zonelike';

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
        });
    }

    private static createHstQuadTree(hstMap: StringMap<Haltestelle, HaltestelleJson>): QuadTree<Haltestelle> {
        const extent = new Extent2d(5, 45, 10, 50); // TODO
        const quadTree = new QuadTree<Haltestelle>(extent, 10); // TODO

        hstMap.forEach(hst => quadTree.addItem(hst));

        return quadTree;
    }


    private static calcVoronoi(hstMap: StringMap<Haltestelle, HaltestelleJson>) {
        // skip hst without kanten or with only fusswege
        const hstList = Array.from(hstMap.values())
            .filter(hst => hst.kantenLut.length > 0)
            .filter(hst => hst.kantenLut.some(kante => kante.verkehrsmittelTyp !== VerkehrsmittelTyp.FUSSWEG));

        VoronoiHelper.calculate(hstList);
    }


    private static calcZonePolygons(zoneMap: StringMap<Zone, ZoneLikeJson>) {
        const zoneList = Array.from(zoneMap.values());

        zoneList.forEach(zone => {
            const hstList: Haltestelle[] = [];
            const kantenWithOneZone = HstKanteZoneHelper.getKantenLinkedToNOtherZonen(zone, 0);
            kantenWithOneZone
                .map(kantZon => kantZon.kante)
                .forEach(kante => HstKanteZoneHelper.addUniqueKantenHst(hstList, kante));

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
            lokalnetz.kanten.forEach(kante => HstKanteZoneHelper.addUniqueKantenHst(hstList, kante));

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
            interbereich.kanten.forEach(kante => HstKanteZoneHelper.addUniqueKantenHst(hstList, kante));

            if (hstList.length > 0) {
                interbereich.polygon = PolygonMerger.unionAdjacentRings(hstList.map(hst => hst.ring));
                interbereich.hstPolygon = new MultiPolygon2d(hstList.map(hst => new Polygon2d(hst.ring)));
            }
        });
    }
}
