import {NovaDrSchema, NovaDrSchemaZone} from './NovaDrSchema';
import {Kante, KanteJson} from '../model/kante';
import {Zone} from '../model/zone';
import {StringMapSer} from '../shared/string-map-ser';
import {ZoneLikeJson} from '../model/zonelike';
import {NovaDrParserHelper} from './NovaDrParserHelper';


export class NovaDrParserZone {
    public static parse(jsonDr: NovaDrSchema, stichdatum: string, kanteMap: StringMapSer<Kante, KanteJson>): StringMapSer<Zone, ZoneLikeJson> {
        const drZonenList = jsonDr.datenrelease.subsystemZonenModell.zonen.zone;
        const zonenMap = new StringMapSer<Zone, ZoneLikeJson>();

        for (const drZone of drZonenList) {
            const id = NovaDrParserHelper.parseIdAttribute(drZone);
            const zone = this.parseZone(id, drZone, stichdatum, kanteMap);

            if (id && zone) {
                zonenMap.set(id, zone);
            }
        }

        return zonenMap;
    }


    private static parseZone(zoneId: string, drZone: NovaDrSchemaZone, stichdatum: string, kantenMap: StringMapSer<Kante, KanteJson>): Zone {
        if (!drZone.version) {
            return undefined;
        }

        for (const drZoneVer of NovaDrParserHelper.asArray(drZone.version)) {
            if (!drZoneVer || !drZoneVer.kanteDefault) {
                continue;
            }

            if (stichdatum < drZoneVer['@_gueltigVon'] || stichdatum > drZoneVer['@_gueltigBis']) {
                continue;
            }

            const kantenList = NovaDrParserHelper.parseKantenIds(drZoneVer.kanteDefault, kantenMap);
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
}
