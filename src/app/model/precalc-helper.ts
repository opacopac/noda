import {DrData} from './dr-data';
import {Haltestelle} from './haltestelle';
import {QuadTree} from '../geo/quad-tree';
import {VoronoiHelper} from '../geo/voronoi-helper';
import {Zone} from './zone';
import {HstKanteZoneHelper} from './hst-kante-zone-helper';
import {PolygonMerger} from '../geo/polygon-merger';
import {MultiPolygon2d} from '../geo/multi-polygon-2d';
import {Polygon2d} from '../geo/polygon-2d';
import {Lokalnetz} from './lokalnetz';
import {Interbereich} from './interbereich';

export class PrecalcHelper {
    private constructor() {}


    public static precalc(drData: DrData): [QuadTree<Haltestelle>, Haltestelle[]] {
        console.log('creating LUTs...');
        this.createKantenLut(drData);
        this.createZonenLut(drData);
        this.createZonenplanLut(drData);
        console.log('creating LUTs completed');

        console.log('creating hst quad tree...');
        const hstQuadTree = this.createHstQuadTree(drData.haltestellen);
        console.log('creating hst quad tree completed');

        console.log('creating hst prio list...');
        const hstPrioList = this.getHstPrioList(drData.haltestellen);
        console.log('creating hst prio list completed');

        console.log('calculating voronoi...');
        this.calcVoronoi(drData.haltestellen);
        console.log('calculating voronoi completed');

        console.log('calculating polygons...');
        this.calcZonePolygons(drData.zonen);
        this.calcLokalnetzPolygons(drData.lokalnetze);
        this.calcInterbereichPolygons(drData.interbereiche);
        console.log('calculating polygons completed');


        return [hstQuadTree, hstPrioList];
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

    private static createHstQuadTree(hstMap: Map<string, Haltestelle>): QuadTree<Haltestelle> {
        const quad = new QuadTree<Haltestelle>(undefined, 5, 10, 45, 50);

        hstMap.forEach(hst => quad.addItem(hst));

        return quad;
    }


    private static getHstPrioList(hstMap: Map<string, Haltestelle>): Haltestelle[] {
        const hstPrioList = Array.from(hstMap.values());
        hstPrioList.sort((hst1: Haltestelle, hst2: Haltestelle) => {
            return hst2.kantenLut.length - hst1.kantenLut.length;
        });

        return hstPrioList;
    }


    private static calcVoronoi(hstMap: Map<string, Haltestelle>) {
        VoronoiHelper.calculate(Array.from(hstMap.values()));
    }


    private static calcZonePolygons(zoneMap: Map<string, Zone>) {
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


    private static calcLokalnetzPolygons(lokalnetzMap: Map<string, Lokalnetz>) {
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


    private static calcInterbereichPolygons(interbereichMap: Map<string, Interbereich>) {
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
