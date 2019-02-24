import {Position2d} from '../geo/position-2d';
import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';


export class Haltestelle implements DataItem {
    public constructor(
        public uic: number,
        public bavName: string,
        public position: Position2d
    ) {
    }


    getType(): DataItemType {
        return DataItemType.Haltestelle;
    }
}
