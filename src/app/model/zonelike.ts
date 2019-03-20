import {Kante} from './kante';
import {Zonenplan} from './zonenplan';
import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';
import {MultiPolygon2d} from '../geo/multi-polygon-2d';
import {JsonSerializable} from '../shared/json-serializable';
import {Haltestelle} from './haltestelle';


export class ZoneLikeJson {
    id: string;
    code: number;
    bez: string;
    kantenIds: string[];
}


export abstract class Zonelike implements DataItem, JsonSerializable<ZoneLikeJson> {
    public zonenplan: Zonenplan;
    public hstLut: Haltestelle[] = [];
    public polygon: MultiPolygon2d;
    public hstPolygon: MultiPolygon2d;


    public constructor(
        public id: string,
        public code: number,
        public kanten: Kante[],
        public bezeichnung?: string
    ) {
    }


    public abstract getType(): DataItemType;



    public toJSON(key: string): ZoneLikeJson {
        return {
            id: this.id,
            code: this.code,
            bez: this.bezeichnung,
            kantenIds: this.kanten.map(kante => kante.id)
        };
    }
}
