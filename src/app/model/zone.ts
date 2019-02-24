import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';
import {Kante} from './kante';
import {Zonenplan} from './zonenplan';


export class Zone implements DataItem {
    public zonenplanLut: Zonenplan[] = [];


    public constructor(
        public code: number,
        public kanten: Kante[],
    ) {
    }


    public getType(): DataItemType {
        return DataItemType.Zone;
    }
}
