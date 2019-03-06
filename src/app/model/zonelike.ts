import {Kante} from './kante';
import {Zonenplan} from './zonenplan';
import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';
import {MultiPolygon2d} from '../geo/multi-polygon-2d';


export abstract class Zonelike implements DataItem {
    public zonenplan: Zonenplan;
    public polygon: MultiPolygon2d;


    public constructor(
        public code: number,
        public kanten: Kante[],
        public bezeichnung?: string
    ) {
    }


    public abstract getType(): DataItemType;
}
