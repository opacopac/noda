import {DataItemType} from './data-item-type';
import {Kante} from './kante';
import {DataItem} from './data-item';
import {MultiPolygon2d} from '../geo/multi-polygon-2d';


export class Interbereich implements DataItem {
    public polygon: MultiPolygon2d;
    public hstPolygon: MultiPolygon2d;


    public constructor(
        public name: string,
        public kanten: Kante[]
    ) {
    }


    public getType(): DataItemType {
        return DataItemType.Interbereich;
    }
}
