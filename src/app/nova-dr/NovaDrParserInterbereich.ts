import {NovaDrSchema, NovaDrSchemaAnkerpunkt, NovaDrSchemaInterbereich} from './NovaDrSchema';
import {Kante, KanteJson} from '../model/kante';
import {Interbereich, InterbereichJson} from '../model/interbereich';
import {StringMapSer} from '../shared/string-map-ser';
import {Ankerpunkt} from '../model/ankerpunkt';
import {Haltestelle, HaltestelleJson} from '../model/haltestelle';
import {NovaDrParserHelper} from './NovaDrParserHelper';


export class NovaDrParserInterbereich {
    public static parse(
        jsonDr: NovaDrSchema,
        stichdatum: string,
        hstMap: StringMapSer<Haltestelle, HaltestelleJson>,
        kanteMap: StringMapSer<Kante, KanteJson>
    ): StringMapSer<Interbereich, InterbereichJson> {
        const interbereichMap = new StringMapSer<Interbereich, InterbereichJson>();
        const drInterbereichList = NovaDrParserHelper.asArray(jsonDr.datenrelease.subsystemInterModell.interBereiche.interBereich);

        for (const drInterbereich of drInterbereichList) {
            const id = NovaDrParserHelper.parseIdAttribute(drInterbereich);
            const interbereich = this.parseInterbereich(drInterbereich, stichdatum, hstMap, kanteMap);

            if (id && interbereich) {
                interbereichMap.set(id, interbereich);
            }
        }

        return interbereichMap;
    }


    private static parseInterbereich(
        drInterbereich: NovaDrSchemaInterbereich,
        stichdatum: string,
        hstMap: StringMapSer<Haltestelle, HaltestelleJson>,
        kantenMap: StringMapSer<Kante, KanteJson>
    ): Interbereich {
        if (!drInterbereich.version) {
            return undefined;
        }

        for (const drInterbereichVer of NovaDrParserHelper.asArray(drInterbereich.version)) {
            if (!drInterbereichVer || !(drInterbereichVer.dvKanten || drInterbereichVer.ivKanten)) {
                continue;
            }

            if (stichdatum < drInterbereichVer['@_gueltigVon'] || stichdatum > drInterbereichVer['@_gueltigBis']) {
                continue;
            }

            const kantenList = [
                ...NovaDrParserHelper.parseKantenIds(drInterbereichVer.dvKanten, kantenMap),
                ...NovaDrParserHelper.parseKantenIds(drInterbereichVer.ivKanten, kantenMap)
            ];
            if (!kantenList || kantenList.length === 0) {
                continue;
            }

            const ankerpunktList = NovaDrParserHelper.asArray(drInterbereichVer.ankerpunkt)
                .map(drAnkerpunkt => this.parseAnkerpunkt(drAnkerpunkt, hstMap, kantenMap))
                .filter(ankerpunkt => ankerpunkt !== undefined);

            return new Interbereich(
                drInterbereichVer.name,
                kantenList,
                ankerpunktList
            );
        }

        return undefined;
    }


    private static parseAnkerpunkt(
        drAnkerpunkt: NovaDrSchemaAnkerpunkt,
        hstMap: StringMapSer<Haltestelle, HaltestelleJson>,
        kantenMap: StringMapSer<Kante, KanteJson>
    ): Ankerpunkt {
        if (!drAnkerpunkt) {
            return undefined;
        }

        const hstList = [
            ...NovaDrParserHelper.parseHaltestellenIds(drAnkerpunkt.hauptHaltestelle, hstMap),
            ...NovaDrParserHelper.parseHaltestellenIds(drAnkerpunkt.subHaltestellen, hstMap)
        ];

        const zubringer: Kante[][] = NovaDrParserHelper.asArray(drAnkerpunkt.ankerpunktZubringer)
            .map(zubr => NovaDrParserHelper.parseKantenIds(zubr.kanten, kantenMap))
            .filter(zubr => zubr.length > 0);

        return new Ankerpunkt(
            drAnkerpunkt.bezeichnung,
            hstList,
            zubringer
        );
    }
}


