import {NovaDrSchema} from './NovaDrSchema';
import {Haltestelle} from '../model/haltestelle';
import {DrMapperHaltestelle} from './DrMapperHaltestelle';


export class NovaDrParserHaltestelle {
    public static readHaltestellenFromJson(jsonDr: NovaDrSchema) {
        const drHstList = jsonDr['ns2:datenrelease'].subsystemNetz.haltestellen.haltestelle;
        const hstList: Haltestelle[] = [];

        for (const drHst of drHstList) {
            const hst = DrMapperHaltestelle.createHaltestelleFromJson(drHst);

            if (hst) {
                hstList.push(hst);
            }
        }

        return hstList;
    }
}
