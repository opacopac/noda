import {DataItemType} from './data-item-type';
import {Kante, KanteJson} from './kante';
import {Zonelike, ZoneLikeJson} from './zonelike';
import {StringMap} from '../shared/string-map';
import {Extent2d} from '../geo/extent-2d';


export class Zone extends Zonelike {
    public constructor(
        id: string,
        code: number,
        kanten: Kante[],
        bezeichnung?: string
    ) {
        super(id, code, kanten, bezeichnung);
    }


    public static fromJSON(json: ZoneLikeJson, kantenMap: StringMap<Kante, KanteJson>): Zone {
        return new Zone(
            json.id,
            json.code,
            json.kantenIds ? json.kantenIds.map(ktid => kantenMap.get(ktid)) : [],
            json.bez
        );
    }


    public getType(): DataItemType {
        return DataItemType.Zone;
    }


    public getExtent(): Extent2d {
        return this.kanten.reduce(
            (acc, kante) => kante.getExtent().getEnvelope(acc),
            undefined as Extent2d
        );
    }
}
