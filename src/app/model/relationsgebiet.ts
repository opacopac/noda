import {DataItemType} from './data-item-type';
import {Haltestelle, HaltestelleJson} from './haltestelle';
import {DataItem} from './data-item';
import {JsonSerializable} from '../shared/json-serializable';
import {StringMapSer} from '../shared/string-map-ser';
import {Extent2d} from '../geo/extent-2d';


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


    public static fromJSON(json: RelationsgebietJson, hstMap: StringMapSer<Haltestelle, HaltestelleJson>): Relationsgebiet {
        const rg = new Relationsgebiet(
            json.id,
            json.nummer,
            json.bezeichnung
        );
        rg.atomicKantenLut = json.atomicHstIds.map(hstIdPair => this.getHstPairFromIds(hstIdPair, hstMap));

        return rg;
    }


    private static getHstPairFromIds(hstIdPair: [string, string], hstMap: StringMapSer<Haltestelle, HaltestelleJson>): [Haltestelle, Haltestelle] {
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


    public getExtent(): Extent2d {
        return this.atomicKantenLut.reduce(
            (acc, hstPair) => Extent2d.getFromPosPair(hstPair[0].position, hstPair[1].position).getEnvelope(acc),
            undefined as Extent2d
        );
    }
}
