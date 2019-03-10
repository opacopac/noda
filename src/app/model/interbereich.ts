import {DataItemType} from './data-item-type';
import {Kante, KanteJson} from './kante';
import {DataItem} from './data-item';
import {MultiPolygon2d} from '../geo/multi-polygon-2d';
import {JsonSerializable} from '../shared/json-serializable';
import {StringMap} from '../shared/string-map';
import {Extent2d} from '../geo/extent-2d';


export interface InterbereichJson {
    name: string;
    kantenIds: string[];
}


export class Interbereich implements DataItem, JsonSerializable<InterbereichJson> {
    public polygon: MultiPolygon2d;
    public hstPolygon: MultiPolygon2d;


    public constructor(
        public name: string,
        public kanten: Kante[]
    ) {
    }


    public static fromJSON(json: InterbereichJson, kantenMap: StringMap<Kante, KanteJson>): Interbereich {
        return new Interbereich(
            json.name,
            json.kantenIds ? json.kantenIds.map(kanteId => kantenMap.get(kanteId)) : []
        );
    }


    public getType(): DataItemType {
        return DataItemType.Interbereich;
    }


    public toJSON(key: string): InterbereichJson {
        return {
            name: this.name,
            kantenIds: this.kanten.map(kante => kante.id)
        };
    }


    public getExtent(): Extent2d {
        return this.kanten.reduce(
            (acc, kante) => kante.getExtent().getEnvelope(acc),
            undefined as Extent2d
        );
    }
}
