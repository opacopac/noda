import {NovaDrSchema, NovaDrSchemaZonenplan} from './NovaDrSchema';
import {Zone} from '../model/zone';
import {Zonenplan} from '../model/zonenplan';
import {isArray} from 'util';
import {Lokalnetz} from '../model/lokalnetz';


export class NovaDrParserZonenplan {
    public static parseZonenplanList(jsonDr: NovaDrSchema, stichdatum: string, zonenMap: Map<string, Zone>, lokalnetzMap: Map<string, Lokalnetz>): Map<string, Zonenplan> {
        const drZonenplanList = jsonDr.datenrelease.subsystemZonenModell.zonenplaene.zonenplan;
        const zonenplanMap: Map<string, Zonenplan> = new Map<string, Zonenplan>();

        for (const drZonenplan of drZonenplanList) {
            const id = this.parseZonenplanId(drZonenplan);
            const zonenplan = this.parseZonenplan(drZonenplan, stichdatum, zonenMap, lokalnetzMap);

            if (id && zonenplan) {
                zonenplanMap.set(id, zonenplan);
            }
        }

        return zonenplanMap;
    }


    private static parseZonenplanId(drZonenplan: NovaDrSchemaZonenplan): string {
        return drZonenplan['@_id'];
    }


    private static parseZonenplan(drZonenplan: NovaDrSchemaZonenplan, stichdatum: string, zonenMap: Map<string, Zone>, lokalnetzMap: Map<string, Lokalnetz>): Zonenplan {
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


    private static parseIdList<T>(idString: string, idEntityMap: Map<string, T>): T[] {
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
