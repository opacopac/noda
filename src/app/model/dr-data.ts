import {Haltestelle, HaltestelleJson} from './haltestelle';
import {Kante, KanteJson} from './kante';
import {Zone} from './zone';
import {Zonenplan, ZonenplanJson} from './zonenplan';
import {Lokalnetz} from './lokalnetz';
import {Relationsgebiet, RelationsgebietJson} from './relationsgebiet';
import {Interbereich, InterbereichJson} from './interbereich';
import {StringMapSer, StringMapJson} from '../shared/string-map-ser';
import {JsonSerializable} from '../shared/json-serializable';
import {ZoneLikeJson} from './zonelike';


interface DrDataJson {
    id: string;
    haltestellen: StringMapJson<HaltestelleJson>;
    kanten: StringMapJson<KanteJson>;
    zonen: StringMapJson<ZoneLikeJson>;
    lokalnetze: StringMapJson<ZoneLikeJson>;
    zonenplaene: StringMapJson<ZonenplanJson>;
    interbereiche: StringMapJson<InterbereichJson>;
    relationsgebiete: StringMapJson<RelationsgebietJson>;
}


export class DrData implements JsonSerializable<DrDataJson> {
    constructor(
        public drId: string,
        public haltestellen: StringMapSer<Haltestelle, HaltestelleJson>,
        public kanten: StringMapSer<Kante, KanteJson>,
        public zonen: StringMapSer<Zone, ZoneLikeJson>,
        public lokalnetze: StringMapSer<Lokalnetz, ZoneLikeJson>,
        public zonenplaene: StringMapSer<Zonenplan, ZonenplanJson>,
        public interbereiche: StringMapSer<Interbereich, InterbereichJson>,
        public relationsgebiete: StringMapSer<Relationsgebiet, RelationsgebietJson>
    ) {
    }


    public static fromJSON(json: DrDataJson): DrData {
        const hstMap = new StringMapSer<Haltestelle, HaltestelleJson>();
        json.haltestellen.map.forEach(entry => hstMap.set(entry.key, Haltestelle.fromJSON(entry.val)));

        const kantenMap = new StringMapSer<Kante, KanteJson>();
        json.kanten.map.forEach(entry => kantenMap.set(entry.key, Kante.fromJSON(entry.val, hstMap)));

        const zonenMap = new StringMapSer<Zone, ZoneLikeJson>();
        json.zonen.map.forEach(entry => zonenMap.set(entry.key, Zone.fromJSON(entry.val, kantenMap)));

        const lokalnetzMap = new StringMapSer<Lokalnetz, ZoneLikeJson>();
        json.lokalnetze.map.forEach(entry => lokalnetzMap.set(entry.key, Lokalnetz.fromJSON(entry.val, kantenMap)));

        const zonenplanMap = new StringMapSer<Zonenplan, ZonenplanJson>();
        json.zonenplaene.map.forEach(entry => zonenplanMap.set(entry.key, Zonenplan.fromJSON(entry.val, zonenMap, lokalnetzMap)));

        const interbereichMap = new StringMapSer<Interbereich, InterbereichJson>();
        json.interbereiche.map.forEach(entry => interbereichMap.set(entry.key, Interbereich.fromJSON(entry.val, hstMap, kantenMap)));

        const relGebMap = new StringMapSer<Relationsgebiet, RelationsgebietJson>();
        json.relationsgebiete.map.forEach(entry => relGebMap.set(entry.key, Relationsgebiet.fromJSON(entry.val, hstMap)));

        return new DrData(
            json.id,
            hstMap,
            kantenMap,
            zonenMap,
            lokalnetzMap,
            zonenplanMap,
            interbereichMap,
            relGebMap
        );
    }


    public toJSON(key: string): DrDataJson {
        return {
            id: this.drId,
            haltestellen: this.haltestellen.toJSON(undefined),
            kanten: this.kanten.toJSON(undefined),
            zonen: this.zonen.toJSON(undefined),
            lokalnetze: this.lokalnetze.toJSON(undefined),
            zonenplaene: this.zonenplaene.toJSON(undefined),
            interbereiche: this.interbereiche.toJSON(undefined),
            relationsgebiete: this.relationsgebiete.toJSON(undefined)
        };
    }
}
