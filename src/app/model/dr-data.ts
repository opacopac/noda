import {Haltestelle} from './haltestelle';
import {Kante} from './kante';
import {Zone} from './zone';
import {Zonenplan} from './zonenplan';
import {QuadTree} from '../geo/quad-tree';


export class DrData {
    constructor(
        public drId: string,
        public haltestellen: Map<string, Haltestelle>,
        public kanten: Map<string, Kante>,
        public zonen: Map<string, Zone>,
        public zonenplaene: Map<string, Zonenplan>,
        public hstQuadTree: QuadTree<Haltestelle>,
        public hstPrioList: Haltestelle[]
    ) { }
}
