import {NovaDrSchema, NovaDrSchemaZonenplan} from './NovaDrSchema';
import {Zone} from '../model/zone';
import {Zonenplan, ZonenplanJson} from '../model/zonenplan';
import {isArray} from 'util';
import {Lokalnetz} from '../model/lokalnetz';
import {StringMap} from '../shared/string-map';
import {ZoneLikeJson} from '../model/zonelike';
import {JsonSerializable} from '../shared/json-serializable';


export class NovaDrParserZonenplan {
    public static parse(
        jsonDr: NovaDrSchema,
        stichdatum: string,
        zonenMap: StringMap<Zone, ZoneLikeJson>,
        lokalnetzMap: StringMap<Lokalnetz, ZoneLikeJson>
    ): StringMap<Zonenplan, ZonenplanJson> {
        const drZonenplanList = jsonDr.datenrelease.subsystemZonenModell.zonenplaene.zonenplan;
        const zonenplanMap = new StringMap<Zonenplan, ZonenplanJson>();

        for (const drZonenplan of drZonenplanList) {
            const id = this.parseId(drZonenplan);
            const zonenplan = this.parseZonenplan(drZonenplan, stichdatum, zonenMap, lokalnetzMap);

            if (id && zonenplan) {
                zonenplanMap.set(id, zonenplan);
            }
        }

        return zonenplanMap;
    }


    private static parseId(drZonenplan: NovaDrSchemaZonenplan): string {
        return drZonenplan['@_id'];
    }


    private static parseZonenplan(drZonenplan: NovaDrSchemaZonenplan, stichdatum: string, zonenMap: StringMap<Zone, ZoneLikeJson>, lokalnetzMap: StringMap<Lokalnetz, ZoneLikeJson>): Zonenplan {
        if (!drZonenplan.version) {
            return undefined;
        }

        if (!isArray(drZonenplan.version)) {
            drZonenplan.version = [drZonenplan.version as any];
        }

        for (const drZonenplanVer of drZonenplan.version) {
            if (!drZonenplanVer || !drZonenplanVer.zonen) {
                continue;
            }

            if (stichdatum < drZonenplanVer['@_gueltigVon'] || stichdatum > drZonenplanVer['@_gueltigBis']) {
                continue;
            }

            const zonenList = this.parseIdList<Zone>(drZonenplanVer.zonen, zonenMap);
            const lokalnetzList = this.parseIdList<Lokalnetz>(drZonenplanVer.lokalnetz, lokalnetzMap);

            return new Zonenplan(
                drZonenplanVer.bezeichnung,
                zonenList,
                lokalnetzList
            );
        }

        return undefined;
    }


    private static parseIdList<T extends JsonSerializable<ZoneLikeJson>>(idString: string, idEntityMap: StringMap<T, ZoneLikeJson>): T[] {
        if (!idString) {
            return [];
        }
        const ids = idString.split(' ');

        if (ids.length === 0) {
            return [];
        }

        return ids
            .map(id => idEntityMap.get(id))
            .filter(entity => entity !== undefined);
    }
}
