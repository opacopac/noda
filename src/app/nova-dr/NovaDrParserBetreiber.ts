import {NovaDrSchemaBetreiber} from './NovaDrSchema';
import {StringMap} from '../shared/string-map-ser';
import {NovaDrParserHelper} from './NovaDrParserHelper';
import {Betreiber} from '../model/betreiber';


export class NovaDrParserBetreiber {
    public static parse(
        betreiberList: NovaDrSchemaBetreiber[],
        stichdatum: string,
    ): StringMap<Betreiber> {
        const betreiberMap = new StringMap<Betreiber>();

        for (const drBetreiber of betreiberList) {
            const id = NovaDrParserHelper.parseIdAttribute(drBetreiber);
            const betreiber = this.parseBetreiber(id, drBetreiber, stichdatum);

            if (id && betreiber) {
                betreiberMap.set(id, betreiber);
            }
        }

        return betreiberMap;
    }


    private static parseBetreiber(
        betreiberId: string,
        drBetreiber: NovaDrSchemaBetreiber,
        stichdatum: string,
    ): Betreiber {
        if (!drBetreiber.version) {
            return undefined;
        }

        for (const drBetreiberVer of NovaDrParserHelper.asArray(drBetreiber.version)) {
            if (!drBetreiberVer) {
                continue;
            }

            if (stichdatum < drBetreiberVer['@_gueltigVon'] || stichdatum > drBetreiberVer['@_gueltigBis']) {
                continue;
            }

            return new Betreiber(
                betreiberId,
                drBetreiberVer.abkuerzung
            );
        }

        return undefined;
    }
}
