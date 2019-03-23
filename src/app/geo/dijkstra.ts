import {Haltestelle} from '../model/haltestelle';
import {Kante} from '../model/kante';
import {PrioQueue} from '../pairing-heap/prio-queue';
import {Position2d} from './position-2d';


export class HstNode {
    public isProcessed = false;

    constructor(
        public hst: Haltestelle,
        public dist: number,
        public via: HstNode,
        public minDistToDest: number,
    ) {
    }


    public getPrioDist(): number {
        return this.dist + this.minDistToDest;
    }
}


export class Dijkstra {
    private hstDistMap: Map<Haltestelle, HstNode>;
    private processQueue: PrioQueue<HstNode>;


    public constructor(
        public hst1: Haltestelle
    ) {
        this.hstDistMap = new Map<Haltestelle, HstNode>();
        const hst1Dist = new HstNode(this.hst1, 0, undefined, 0);
        this.hstDistMap.set(this.hst1, hst1Dist);

        this.processQueue = new PrioQueue<HstNode>(hstNode => hstNode.getPrioDist());
        this.processQueue.insert(hst1Dist);
    }


    public getShortestPath(hst2: Haltestelle): Kante[] {
        while (this.processQueue.findMin() !== undefined) {
            const minDistEntry = this.processQueue.findMin();
            this.processQueue.popMin();

            if (minDistEntry.isProcessed) {
                continue;
            } else {
                minDistEntry.isProcessed = true;
            }

            if (minDistEntry.hst === hst2) {
                return this.getPath(minDistEntry);
            }

            const neighbours = this.getUnprocessedNeighbours(minDistEntry);

            neighbours.forEach(neighbour => {
                this.processQueue.insert(neighbour);

                const altDist = minDistEntry.dist + this.getDist(minDistEntry.hst, neighbour.hst);
                if (altDist < neighbour.dist) {
                    neighbour.dist = altDist;
                    neighbour.via = minDistEntry;
                }
            });
        }

        return undefined;
    }


    private getUnprocessedNeighbours(hstEntry: HstNode): HstNode[] {
        return hstEntry.hst.kantenLut
            .map(kante => kante.getOtherHst(hstEntry.hst))
            .map(hst => this.getHstDistOrCreateNew(hst))
            .filter(hstDist => hstDist.isProcessed === false);
    }


    private getHstDistOrCreateNew(hst: Haltestelle): HstNode {
        let hstDist = this.hstDistMap.get(hst);
        if (!hstDist) {
            hstDist = new HstNode(hst, Number.MAX_VALUE, undefined, this.getPrioDist(hst));
            this.hstDistMap.set(hst, hstDist);
        }
        return hstDist;
    }


    private getDist(hst1: Haltestelle, hst2: Haltestelle): number {
        return Position2d.getFakeEuclidDist(hst1.position, hst2.position) * 1.5;
        // return 1;
    }


    private getPrioDist(hst: Haltestelle): number {
        return Position2d.getFakeEuclidDist(hst.position, this.hst1.position);
    }


    private getPath(hst2Entry: HstNode): Kante[] {
        const path: Kante[] = [];
        let currEntry = hst2Entry;

        while (currEntry && currEntry.via) {
            const kante = this.getKante(currEntry.hst, currEntry.via.hst);
            path.push(kante);
            currEntry = currEntry.via;
        }

        return path;
    }


    private getKante(hst1: Haltestelle, hst2: Haltestelle): Kante {
        for (const kante of hst1.kantenLut) {
            if ((kante.haltestelle1 === hst1 && kante.haltestelle2 === hst2)
                || (kante.haltestelle2 === hst1 && kante.haltestelle1 === hst2)) {
                return kante;
            }
        }

        return undefined;
    }
}
