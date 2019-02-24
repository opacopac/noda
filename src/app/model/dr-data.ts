import {Haltestelle} from './haltestelle';
import {Kante} from './kante';


export class DrData {
    constructor(
        public drId: string,
        public haltestellen: Map<string, Haltestelle>,
        public kanten: Map<string, Kante>
    ) { }
}
