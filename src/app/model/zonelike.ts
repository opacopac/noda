import {Kante} from './kante';
import {Zonenplan} from './zonenplan';
import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';


export abstract class Zonelike implements DataItem {
    public zonenplanLut: Zonenplan[] = [];


    public constructor(
        public code: number,
        public kanten: Kante[],
        public bezeichnung?: string
    ) {
    }


    public abstract getType(): DataItemType;
}
