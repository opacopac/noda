import {DataItemType} from './data-item-type';
import {Kante} from './kante';
import {DataItem} from './data-item';


export class Interbereich implements DataItem {
    public constructor(
        public name: string,
        public kanten: Kante[]
    ) {
    }


    public getType(): DataItemType {
        return DataItemType.Interbereich;
    }
}
