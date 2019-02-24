import {NovaDrSchema, NovaDrSchemaZone} from './NovaDrSchema';
import {Kante} from '../model/kante';
import {Zone} from '../model/zone';


export class NovaDrParserZone {
    public static parseZoneList(jsonDr: NovaDrSchema, kanteMap: Map<string, Kante>): Map<string, Zone> {
        const drZonenList = jsonDr.datenrelease.subsystemZonenModell.zonen.zone;
        const zonenMap: Map<string, Zone> = new Map<string, Zone>();

        for (const drZone of drZonenList) {
            const id = this.parseZoneId(drZone);
            const zone = this.parseZone(drZone, kanteMap);

            if (id && zone) {
                zonenMap.set(id, zone);
            }
        }

        return zonenMap;
    }


    private static parseZoneId(drKante: NovaDrSchemaZone): string {
        return drKante['@_id'];
    }


    private static parseZone(drZone: NovaDrSchemaZone, kantenMap: Map<string, Kante>): Zone {
        const drZoneVer = drZone.version;
        if (!drZoneVer || !drZoneVer.kanteDefault) {
            return undefined;
        }

        const kantenList = this.parseKantenList(drZoneVer.kanteDefault, kantenMap);
        if (!kantenList || kantenList.length === 0) {
            return undefined;
        }

        return new Zone(
            parseInt(drZoneVer.code, 10),
            kantenList
        );
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
