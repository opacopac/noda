import {NovaDrSchema, NovaDrSchemaZonenplan} from './NovaDrSchema';
import {Zone} from '../model/zone';
import {Zonenplan} from '../model/zonenplan';
import {isArray} from "util";


export class NovaDrParserZonenplan {
    public static parseZonenplanList(jsonDr: NovaDrSchema, stichdatum: string, zonenMap: Map<string, Zone>): Map<string, Zonenplan> {
        const drZonenplanList = jsonDr.datenrelease.subsystemZonenModell.zonenplaene.zonenplan;
        const zonenplanMap: Map<string, Zonenplan> = new Map<string, Zonenplan>();

        for (const drZonenplan of drZonenplanList) {
            console.log(drZonenplan);
            const id = this.parseZonenplanId(drZonenplan);
            const zonenplan = this.parseZonenplan(drZonenplan, stichdatum, zonenMap);

            console.log(zonenplan);

            if (id && zonenplan) {
                zonenplanMap.set(id, zonenplan);
                console.log('ok');
            } else {
                console.error('NOK');
            }
        }

        return zonenplanMap;
    }


    private static parseZonenplanId(drKante: NovaDrSchemaZonenplan): string {
        return drKante['@_id'];
    }


    private static parseZonenplan(drZonenplan: NovaDrSchemaZonenplan, stichdatum: string, zonenMap: Map<string, Zone>): Zonenplan {
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

            const zonenList = this.parseZonenList(drZonenplanVer.zonen, zonenMap);
            if (!zonenList || zonenList.length === 0) {
                continue;
            }

            return new Zonenplan(
                drZonenplanVer.bezeichnung,
                zonenList
            );
        }

        return undefined;
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
