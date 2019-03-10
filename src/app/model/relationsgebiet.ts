import {DataItemType} from './data-item-type';
import {Haltestelle, HaltestelleJson} from './haltestelle';
import {DataItem} from './data-item';
import {JsonSerializable} from '../shared/json-serializable';
import {StringMap} from '../shared/string-map';


export interface RelationsgebietJson {
    id: string;
    nummer: number;
    bezeichnung: string;
    atomicHstIds: [string, string][];
}


export class Relationsgebiet implements DataItem, JsonSerializable<RelationsgebietJson> {
    public haltestellenLut: Haltestelle[] = [];
    public atomicKantenLut: [Haltestelle, Haltestelle][] = [];


    public constructor(
        public id: string,
        public nummer: number,
        public bezeichnung: string,
    ) {
    }


    public static fromJSON(json: RelationsgebietJson, hstMap: StringMap<Haltestelle, HaltestelleJson>): Relationsgebiet {
        const rg = new Relationsgebiet(
            json.id,
            json.nummer,
            json.bezeichnung
        );
        rg.atomicKantenLut = json.atomicHstIds.map(hstIdPair => this.getHstPairFromIds(hstIdPair, hstMap));

        return rg;
    }


    private static getHstPairFromIds(hstIdPair: [string, string], hstMap: StringMap<Haltestelle, HaltestelleJson>): [Haltestelle, Haltestelle] {
        return [hstMap.get(hstIdPair[0]), hstMap.get(hstIdPair[1])];
    }


    public getType(): DataItemType {
        return DataItemType.Relationsgebiet;
    }


    public toJSON(key: string): RelationsgebietJson {
        return {
            id: this.id,
            nummer: this.nummer,
            bezeichnung: this.bezeichnung,
            atomicHstIds: this.atomicKantenLut.map(hstPair => this.getHstIdPair(hstPair))
        };
    }


    private getHstIdPair(hstPair: [Haltestelle, Haltestelle]): [string, string] {
        return [hstPair[0].id, hstPair[1].id];
    }


}
