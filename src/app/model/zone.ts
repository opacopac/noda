import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';
import {Kante} from './kante';


export class Zone implements DataItem {
    public constructor(
        public code: number,
        public kanten: Kante[],
    ) {
    }


    public getType(): DataItemType {
        return DataItemType.Zone;
    }
}
