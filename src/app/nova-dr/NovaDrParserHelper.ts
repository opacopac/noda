import {StringMap} from '../shared/string-map';
import {Kante, KanteJson} from '../model/kante';
import {Haltestelle, HaltestelleJson} from '../model/haltestelle';
import {IdAttribute} from './NovaDrSchema';
import {ZoneLikeJson} from '../model/zonelike';
import {Zone} from '../model/zone';
import {JsonSerializable} from '../shared/json-serializable';
import {Lokalnetz} from '../model/lokalnetz';
import {isArray} from 'util';


export class NovaDrParserHelper {
    private static readonly ID_SEPARATOR = ' ';


    private constructor() { }


    public static asArray(element: any) {
        if (!element) {
            return [];
        }

        return isArray(element) ? element : [element];
    }


    public static parseIdAttribute(drIdAttribute: IdAttribute): string {
        return drIdAttribute['@_id'];
    }


    public static parseHaltestellenIds(idString: string, hstMap: StringMap<Haltestelle, HaltestelleJson>): Haltestelle[] {
        return this.parseEntityIds<Haltestelle, HaltestelleJson>(idString, hstMap);
    }


    public static parseKantenIds(idString: string, kantenMap: StringMap<Kante, KanteJson>): Kante[] {
        return this.parseEntityIds<Kante, KanteJson>(idString, kantenMap);
    }


    public static parseZonenIds(idString: string, zonenMap: StringMap<Zone, ZoneLikeJson>): Zone[] {
        return this.parseEntityIds<Zone, ZoneLikeJson>(idString, zonenMap);
    }


    public static parseLokalnetzIds(idString: string, lokalnetzMap: StringMap<Lokalnetz, ZoneLikeJson>): Lokalnetz[] {
        return this.parseEntityIds<Lokalnetz, ZoneLikeJson>(idString, lokalnetzMap);
    }


    private static parseEntityIds<T extends JsonSerializable<K>, K>(idString: string, idEntityMap: StringMap<T, K>): T[] {
        const ids = this.parseIdList(idString);

        return ids
            .map(id => idEntityMap.get(id))
            .filter(entity => entity !== undefined);
    }


    private static parseIdList(idString: string): string[] {
        if (!idString) {
            return [];
        }

        return idString.split(this.ID_SEPARATOR);
    }
}
