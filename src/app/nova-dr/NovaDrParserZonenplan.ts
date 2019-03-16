import {NovaDrSchema, NovaDrSchemaZonenplan} from './NovaDrSchema';
import {Zone} from '../model/zone';
import {Zonenplan, ZonenplanJson} from '../model/zonenplan';
import {Lokalnetz} from '../model/lokalnetz';
import {StringMap} from '../shared/string-map';
import {ZoneLikeJson} from '../model/zonelike';
import {NovaDrParserHelper} from './NovaDrParserHelper';


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
            const id = NovaDrParserHelper.parseIdAttribute(drZonenplan);
            const zonenplan = this.parseZonenplan(drZonenplan, stichdatum, zonenMap, lokalnetzMap);

            if (id && zonenplan) {
                zonenplanMap.set(id, zonenplan);
            }
        }

        return zonenplanMap;
    }


    private static parseZonenplan(drZonenplan: NovaDrSchemaZonenplan, stichdatum: string, zonenMap: StringMap<Zone, ZoneLikeJson>, lokalnetzMap: StringMap<Lokalnetz, ZoneLikeJson>): Zonenplan {
        if (!drZonenplan.version) {
            return undefined;
        }

        drZonenplan.version = NovaDrParserHelper.asArray(drZonenplan.version);

        for (const drZonenplanVer of drZonenplan.version) {
            if (!drZonenplanVer || !drZonenplanVer.zonen) {
                continue;
            }

            if (stichdatum < drZonenplanVer['@_gueltigVon'] || stichdatum > drZonenplanVer['@_gueltigBis']) {
                continue;
            }

            const zonenList = NovaDrParserHelper.parseZonenIds(drZonenplanVer.zonen, zonenMap);
            const lokalnetzList = NovaDrParserHelper.parseLokalnetzIds(drZonenplanVer.lokalnetz, lokalnetzMap);

            return new Zonenplan(
                drZonenplanVer.bezeichnung,
                zonenList,
                lokalnetzList
            );
        }

        return undefined;
    }
}
