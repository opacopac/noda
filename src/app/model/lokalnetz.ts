import {DataItemType} from './data-item-type';
import {Kante, KanteJson} from './kante';
import {Zonelike, ZoneLikeJson} from './zonelike';
import {StringMapSer} from '../shared/string-map-ser';


export class Lokalnetz extends Zonelike {
    public constructor(
        id: string,
        code: number,
        kanten: Kante[],
        bezeichnung: string,
    ) {
        super(id, code, kanten, bezeichnung);
    }


    public static fromJSON(json: ZoneLikeJson, kantenMap: StringMapSer<Kante, KanteJson>): Lokalnetz {
        return new Lokalnetz(
            json.id,
            json.code,
            json.kantenIds ? json.kantenIds.map(ktid => kantenMap.get(ktid)) : [],
            json.bez
        );
    }


    public getType(): DataItemType {
        return DataItemType.Lokalnetz;
    }
}
