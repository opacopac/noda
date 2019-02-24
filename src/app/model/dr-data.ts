import {Haltestelle} from './haltestelle';
import {Kante} from './kante';
import {Zone} from './zone';
import {Zonenplan} from './zonenplan';


export class DrData {
    constructor(
        public drId: string,
        public haltestellen: Map<string, Haltestelle>,
        public kanten: Map<string, Kante>,
        public zonen: Map<string, Zone>,
        public zonenplaene: Map<string, Zonenplan>
    ) { }
}
