import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';
import {Zone} from './zone';
import {Lokalnetz} from './lokalnetz';


export class Zonenplan implements DataItem {
    public constructor(
        public bezeichnung: string,
        public zonen: Zone[],
        public lokalnetze: Lokalnetz[]
    ) {
    }


    public getType(): DataItemType {
        return DataItemType.Zonenplan;
    }
}
