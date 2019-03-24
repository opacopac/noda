import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';
import {Zone} from './zone';
import {Lokalnetz} from './lokalnetz';
import {JsonSerializable} from '../shared/json-serializable';
import {ZoneLikeJson} from './zonelike';
import {StringMapSer} from '../shared/string-map-ser';
import {Extent2d} from '../geo/extent-2d';


export interface ZonenplanJson {
    bezeichnung: string;
    zonenIds: string[];
    lokalnetzIds: string[];
}


export class Zonenplan implements DataItem, JsonSerializable<ZonenplanJson> {
    public isCroppedPolygons = false;

    public constructor(
        public bezeichnung: string,
        public zonen: Zone[],
        public lokalnetze: Lokalnetz[]
    ) {
    }


    public static fromJSON(
        json: ZonenplanJson,
        zonenMap: StringMapSer<Zone, ZoneLikeJson>,
        lokalnetzMap: StringMapSer<Lokalnetz, ZoneLikeJson>
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


    public getExtent(): Extent2d {
        return this.zonen.reduce(
            (acc, zone) => zone.getExtent().getEnvelope(acc),
            undefined as Extent2d
        );
    }
}
