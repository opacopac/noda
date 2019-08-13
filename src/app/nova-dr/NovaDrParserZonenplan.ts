import {NovaDrSchemaZonenplan} from './NovaDrSchema';
import {Zone} from '../model/zone';
import {Zonenplan, ZonenplanJson} from '../model/zonenplan';
import {Lokalnetz} from '../model/lokalnetz';
import {StringMapSer} from '../shared/string-map-ser';
import {ZoneLikeJson} from '../model/zonelike';
import {NovaDrParserHelper} from './NovaDrParserHelper';


export class NovaDrParserZonenplan {
    public static parse(
        drZonenplanList: NovaDrSchemaZonenplan[],
        stichdatum: string,
        zonenMap: StringMapSer<Zone, ZoneLikeJson>,
        lokalnetzMap: StringMapSer<Lokalnetz, ZoneLikeJson>
    ): StringMapSer<Zonenplan, ZonenplanJson> {
        const zonenplanMap = new StringMapSer<Zonenplan, ZonenplanJson>();

        for (const drZonenplan of drZonenplanList) {
            const id = NovaDrParserHelper.parseIdAttribute(drZonenplan);
            const zonenplan = this.parseZonenplan(drZonenplan, stichdatum, zonenMap, lokalnetzMap);

            if (id && zonenplan) {
                zonenplanMap.set(id, zonenplan);
            }
        }

        return zonenplanMap;
    }


    private static parseZonenplan(drZonenplan: NovaDrSchemaZonenplan, stichdatum: string, zonenMap: StringMapSer<Zone, ZoneLikeJson>, lokalnetzMap: StringMapSer<Lokalnetz, ZoneLikeJson>): Zonenplan {
        if (!drZonenplan.version) {
            return undefined;
        }

        for (const drZonenplanVer of NovaDrParserHelper.asArray(drZonenplan.version)) {
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
