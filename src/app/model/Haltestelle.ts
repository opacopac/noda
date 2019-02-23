import {Position2d} from './Position2d';


export class Haltestelle {
    public constructor(
        public id: string,
        public uic: number,
        public bavName: string,
        public position: Position2d
    ) {
    }
}
