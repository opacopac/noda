import {NovaDrSchema, NovaDrSchemaZone} from './NovaDrSchema';
import {Kante, KanteJson} from '../model/kante';
import {Zone} from '../model/zone';
import {isArray} from 'util';
import {StringMap} from '../shared/string-map';
import {ZoneLikeJson} from '../model/zonelike';


export class NovaDrParserZone {
    public static parse(jsonDr: NovaDrSchema, stichdatum: string, kanteMap: StringMap<Kante, KanteJson>): StringMap<Zone, ZoneLikeJson> {
        const drZonenList = jsonDr.datenrelease.subsystemZonenModell.zonen.zone;
        const zonenMap = new StringMap<Zone, ZoneLikeJson>();

        for (const drZone of drZonenList) {
            const id = this.parseZoneId(drZone);
            const zone = this.parseZone(id, drZone, stichdatum, kanteMap);

            if (id && zone) {
                zonenMap.set(id, zone);
            }
        }

        return zonenMap;
    }


    private static parseZoneId(drKante: NovaDrSchemaZone): string {
        return drKante['@_id'];
    }


    private static parseZone(zoneId: string, drZone: NovaDrSchemaZone, stichdatum: string, kantenMap: StringMap<Kante, KanteJson>): Zone {
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
                zoneId,
                parseInt(drZoneVer.code, 10),
                kantenList
            );
        }

        return undefined;
    }


    private static parseKantenList(idString: string, kantenMap: StringMap<Kante, KanteJson>): Kante[] {
        const zonenIds = idString.split(' ');

        if (zonenIds.length === 0) {
            return undefined;
        }

        return zonenIds
            .map(id => kantenMap.get(id))
            .filter(kante => kante !== undefined);
    }
}
