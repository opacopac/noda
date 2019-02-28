import {DataItemType} from './data-item-type';
import {DataItem} from './data-item';
import {Haltestelle} from './haltestelle';
import {Relationsgebiet} from './relationsgebiet';


export class Relation implements DataItem {
    public constructor(
        public relationsgebiet: Relationsgebiet,
        public haltestelle1: Haltestelle,
        public halstetelle2: Haltestelle,
    ) {
    }


    public getType(): DataItemType {
        return DataItemType.Relation;
    }
}
