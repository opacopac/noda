import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';
import {Haltestelle} from './haltestelle';


export class Kante implements DataItem {
    public constructor(
        public haltestelle1: Haltestelle,
        public haltestelle2: Haltestelle,
        public verkehrsmittelTyp: string,
    ) {
    }


    public getType(): DataItemType {
        return DataItemType.Kante;
    }
}
