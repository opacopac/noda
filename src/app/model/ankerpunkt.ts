import {Kante, KanteJson} from './kante';
import {JsonSerializable} from '../shared/json-serializable';
import {StringMapSer} from '../shared/string-map-ser';
import {Haltestelle, HaltestelleJson} from './haltestelle';


export interface AnkerpunktJson {
    name: string;
    hstIds: string[];
    zubringer: AnkerpunktzubringerJson[];
}


export interface AnkerpunktzubringerJson {
    kantenIds: string[];
}


export class Ankerpunkt implements JsonSerializable<AnkerpunktJson> {
    public constructor(
        public name: string,
        public haltestellenList: Haltestelle[],
        public zubringerList: Kante[][],
    ) {
    }


    public static fromJSON(
        json: AnkerpunktJson,
        hstMap: StringMapSer<Haltestelle, HaltestelleJson>,
        kantenMap: StringMapSer<Kante, KanteJson>
    ): Ankerpunkt {
        return new Ankerpunkt(
            json.name,
            json.hstIds ? json.hstIds.map(hstId => hstMap.get(hstId)) : [],
            json.zubringer ?
                json.zubringer.map(zubr => zubr.kantenIds.map(kanteId => kantenMap.get(kanteId)))
                : []
        );
    }


    public toJSON(key: string): AnkerpunktJson {
        return {
            name: this.name,
            hstIds: this.haltestellenList.map(hst => hst.id),
            zubringer: this.zubringerList.map(zubringer => {
                return {
                    kantenIds: zubringer.map(kante => kante.id)
                };
            })
        };
    }
}
