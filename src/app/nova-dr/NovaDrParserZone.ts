import {NovaDrSchema, NovaDrSchemaZone} from './NovaDrSchema';
import {Kante} from '../model/kante';
import {Zone} from '../model/zone';
import {isArray} from 'util';


export class NovaDrParserZone {
    public static parse(jsonDr: NovaDrSchema, stichdatum: string, kanteMap: Map<string, Kante>): Map<string, Zone> {
        const drZonenList = jsonDr.datenrelease.subsystemZonenModell.zonen.zone;
        const zonenMap: Map<string, Zone> = new Map<string, Zone>();

        for (const drZone of drZonenList) {
            const id = this.parseZoneId(drZone);
            const zone = this.parseZone(drZone, stichdatum, kanteMap);

            if (id && zone) {
                zonenMap.set(id, zone);
            }
        }

        return zonenMap;
    }


    private static parseZoneId(drKante: NovaDrSchemaZone): string {
        return drKante['@_id'];
    }


    private static parseZone(drZone: NovaDrSchemaZone, stichdatum: string, kantenMap: Map<string, Kante>): Zone {
        if (!drZone.version) {
            return undefined;
        }

        if (!isArray(drZone.version)) {
            drZone.version = [drZone.version as any];
        }

        for (const drZoneVer of drZone.version) {
            if (!drZoneVer || !drZoneVer.kanteDefault) {
                continue;
            }

            if (stichdatum < drZoneVer['@_gueltigVon'] || stichdatum > drZoneVer['@_gueltigBis']) {
                continue;
            }

            const kantenList = this.parseKantenList(drZoneVer.kanteDefault, kantenMap);
            if (!kantenList || kantenList.length === 0) {
                continue;
            }

            return new Zone(
                parseInt(drZoneVer.code, 10),
                kantenList
            );
        }

        return undefined;
    }


    private static parseKantenList(idString: string, kantenMap: Map<string, Kante>): Kante[] {
        const zonenIds = idString.split(' ');

        if (zonenIds.length === 0) {
            return undefined;
        }

        return zonenIds
            .map(id => kantenMap.get(id))
            .filter(kante => kante !== undefined);
    }
}
