import {Ring2d} from './ring-2d';
import {MultiPolygon2d} from './multi-polygon-2d';
import {Edge2d} from './edge-2d';
import {Position2d} from './position-2d';
import {Polygon2d} from './polygon-2d';


export class PolygonMerger {
    private constructor() {}


    public static unionAdjacentRings(ringList: Ring2d[]): MultiPolygon2d {
        const uniqueEdgeMap = this.getUniqueEdges(ringList);
        const newRings = this.recreateRings(uniqueEdgeMap);
        const polygonList = this.createPolygons(newRings);

        return new MultiPolygon2d(polygonList);
    }


    private static getUniqueEdges(ringList: Ring2d[]): Map<string, Edge2d[]> {
        const edgeMap: Map<string, Edge2d[]> = new Map<string, Edge2d[]>();

        ringList
            .filter(ring => ring !== undefined)
            .forEach(ring => {
                ring.getEdgeList().forEach(edge => {
                    this.addEdgeOrRemoveReverseDuplicate(edgeMap, edge);
                });
            });

        return edgeMap;
    }


    private static addEdgeOrRemoveReverseDuplicate(edgeMap: Map<string, Edge2d[]>, newEdge: Edge2d) {
        const pos2Key = this.getPosKey(newEdge.pos2);
        let edgeList = edgeMap.get(pos2Key);

        if (edgeList) {
            const dupIdx = this.getReverseDuplicateIndex(edgeList, newEdge);
            if (dupIdx >= 0) {
                edgeList.splice(dupIdx, 1);
                return;
            }
        }

        const pos1Key = this.getPosKey(newEdge.pos1);
        edgeList = edgeMap.get(pos1Key);

        if (!edgeList) {
            edgeList = [];
            edgeMap.set(pos1Key, edgeList);
        }

        edgeList.push(newEdge);
    }


    private static getReverseDuplicateIndex(edgeList: Edge2d[], newEdge: Edge2d): number {
        for (let i = 0; i < edgeList.length; i++) {
            if (edgeList[i].equalsReverse(newEdge)) {
                return i;
            }
        }

        return -1;
    }


    private static getPosKey(pos: Position2d): string {
        return pos.longitude + '_' + pos.latitude;
    }


    private static recreateRings(edgeMap: Map<string, Edge2d[]>): Ring2d[] {
        const rings: Ring2d[] = [];

        while (edgeMap.size > 0) {
            const firstEdgeKey = edgeMap.keys().next().value;
            const firstEdgeList = edgeMap.get(firstEdgeKey);
            if (firstEdgeList.length === 0) {
                edgeMap.delete(firstEdgeKey);
                continue;
            }

            const edgeList: Edge2d[] = [];
            this.followEdge(edgeMap, edgeList, firstEdgeList[0]);
            rings.push(Ring2d.fromEdgeList(edgeList));
        }

        return rings;
    }


    private static followEdge(edgeMap: Map<string, Edge2d[]>, edgeList: Edge2d[], prevEdge: Edge2d) {
        const key = this.getPosKey(prevEdge.pos2);
        const nextEdgeList = edgeMap.get(key);

        if (!nextEdgeList || nextEdgeList.length === 0) {
            return;
        } else {
            const nextEdge = nextEdgeList.splice(0, 1)[0];
            if (nextEdgeList.length === 0) {
                edgeMap.delete(key);
            }
            edgeList.push(nextEdge);
            this.followEdge(edgeMap, edgeList, nextEdge);
        }
    }


    private static createPolygons(ringList: Ring2d[]): Polygon2d[] {
        const polygonList: Polygon2d[] = [];

        const outerRings = ringList.filter(ring => ring.isClockwise());
        const holes = ringList.filter(ring => !ring.isClockwise());

        outerRings.forEach(outerRing => {
            const polygon = new Polygon2d(outerRing);
            holes.forEach(hole => {
                if (outerRing.containsAllPoints(hole.positionList)) {
                    polygon.holes.push(hole);
                }
            });

            polygonList.push(polygon);
        });

        return polygonList;
    }
}
