import {NovaDrSchemaVerwaltung} from './NovaDrSchema';
import {StringMap} from '../shared/string-map-ser';
import {NovaDrParserHelper} from './NovaDrParserHelper';
import {Betreiber} from '../model/betreiber';
import {Verwaltung} from '../model/verwaltung';


export class NovaDrParserVerwaltung {
    public static parse(
        verwaltungList: NovaDrSchemaVerwaltung[],
        stichdatum: string,
        betreiberMap: StringMap<Betreiber>
    ): StringMap<Verwaltung> {
        const verwaltungMap = new StringMap<Verwaltung>();

        for (const drVerwaltung of verwaltungList) {
            const id = NovaDrParserHelper.parseIdAttribute(drVerwaltung);
            const verwaltung = this.parseVerwaltung(id, drVerwaltung, stichdatum, betreiberMap);

            if (id && verwaltung) {
                verwaltungMap.set(id, verwaltung);
            }
        }

        return verwaltungMap;
    }


    private static parseVerwaltung(
        verwaltungId: string,
        drVerwaltung: NovaDrSchemaVerwaltung,
        stichdatum: string,
        betreiberMap: StringMap<Betreiber>
    ): Verwaltung {
        if (!drVerwaltung.version) {
            return undefined;
        }

        for (const drVerwaltungVer of NovaDrParserHelper.asArray(drVerwaltung.version)) {
            if (!drVerwaltungVer || !drVerwaltungVer.betreiber) {
                continue;
            }

            if (stichdatum < drVerwaltungVer['@_gueltigVon'] || stichdatum > drVerwaltungVer['@_gueltigBis']) {
                continue;
            }

            const betreiber = betreiberMap.get(drVerwaltungVer.betreiber);
            if (!betreiber) {
                continue;
            }

            return new Verwaltung(
                verwaltungId,
                betreiber
            );
        }

        return undefined;
    }
}
