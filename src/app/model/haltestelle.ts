import {Position2d} from '../geo/position-2d';
import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';
import {Kante} from './kante';
import {Positionable} from '../geo/positionable';


export class Haltestelle implements DataItem, Positionable {
    public kantenLut: Kante[] = [];
    public polygon: Position2d[] = [];


    public constructor(
        public uic: number,
        public bavName: string,
        public position: Position2d
    ) {
    }


    getType(): DataItemType {
        return DataItemType.Haltestelle;
    }


    getPosition(): Position2d {
        return this.position;
    }
}
