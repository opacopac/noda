import {NovaDrSchema, NovaDrSchemaZonenplan} from './NovaDrSchema';
import {Zone} from '../model/zone';
import {Zonenplan} from '../model/zonenplan';


export class NovaDrParserZonenplan {
    public static parseZonenplanList(jsonDr: NovaDrSchema, zonenMap: Map<string, Zone>): Map<string, Zonenplan> {
        const drZonenplanList = jsonDr.datenrelease.subsystemZonenModell.zonenplaene.zonenplan;
        const zonenplanMap: Map<string, Zonenplan> = new Map<string, Zonenplan>();

        for (const drZonenplan of drZonenplanList) {
            const id = this.parseZonenplanId(drZonenplan);
            const zonenplan = this.parseZonenplan(drZonenplan, zonenMap);

            if (id && zonenplan) {
                zonenplanMap.set(id, zonenplan);
            }
        }

        return zonenplanMap;
    }


    private static parseZonenplanId(drKante: NovaDrSchemaZonenplan): string {
        return drKante['@_id'];
    }


    private static parseZonenplan(drZonenplan: NovaDrSchemaZonenplan, zonenMap: Map<string, Zone>): Zonenplan {
        const drZonenplanVer = drZonenplan.version;
        if (!drZonenplanVer || !drZonenplanVer.zonen) {
            return undefined;
        }

        const zonenList = this.parseZonenList(drZonenplanVer.zonen, zonenMap);
        if (!zonenList || zonenList.length === 0) {
            return undefined;
        }

        return new Zonenplan(
            drZonenplanVer.bezeichnung,
            zonenList
        );
    }


    private static parseZonenList(idString: string, zonenMap: Map<string, Zone>): Zone[] {
        const zonenIds = idString.split(' ');

        if (zonenIds.length === 0) {
            return undefined;
        }

        return zonenIds
            .map(id => zonenMap.get(id))
            .filter(zone => zone !== undefined);
    }
}
