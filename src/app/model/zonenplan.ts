import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';
import {Zone} from './zone';
import {Lokalnetz} from './lokalnetz';
import {JsonSerializable} from '../shared/json-serializable';
import {ZoneLikeJson} from './zonelike';
import {StringMap} from '../shared/string-map';


export interface ZonenplanJson {
    bezeichnung: string;
    zonenIds: string[];
    lokalnetzIds: string[];
}


export class Zonenplan implements DataItem, JsonSerializable<ZonenplanJson> {
    public constructor(
        public bezeichnung: string,
        public zonen: Zone[],
        public lokalnetze: Lokalnetz[]
    ) {
    }


    public static fromJSON(
        json: ZonenplanJson,
        zonenMap: StringMap<Zone, ZoneLikeJson>,
        lokalnetzMap: StringMap<Lokalnetz, ZoneLikeJson>
    ): Zonenplan {
        return new Zonenplan(
            json.bezeichnung,
            json.zonenIds ? json.zonenIds.map(zonenId => zonenMap.get(zonenId)) : [],
            json.lokalnetzIds ? json.lokalnetzIds.map(lokalnetzId => lokalnetzMap.get(lokalnetzId)) : []
        );
    }


    public getType(): DataItemType {
        return DataItemType.Zonenplan;
    }


    public toJSON(key: string): ZonenplanJson {
        return {
            bezeichnung: this.bezeichnung,
            zonenIds: this.zonen.map(zone => zone.id),
            lokalnetzIds: this.lokalnetze.map(lokalnetz => lokalnetz.id)
        };
    }
}
