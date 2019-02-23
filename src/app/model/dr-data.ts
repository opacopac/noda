import {Haltestelle} from './haltestelle';


export class DrData {
    constructor(
        public drVersion: string,
        public haltestellen: Haltestelle[]
    ) { }
}
