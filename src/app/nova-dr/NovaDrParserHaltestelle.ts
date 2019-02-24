import {NovaDrSchema, NovaDrSchemaHaltestelle} from './NovaDrSchema';
import {Haltestelle} from '../model/haltestelle';
import {Position2d} from '../geo/position-2d';


export class NovaDrParserHaltestelle {
    public static parseHaltestelleList(jsonDr: NovaDrSchema): Map<string, Haltestelle> {
        const drHstList = jsonDr.datenrelease.subsystemNetz.haltestellen.haltestelle;
        const hstList: Map<string, Haltestelle> = new Map<string, Haltestelle>();

        for (const drHst of drHstList) {
            const id = this.parseHaltestelleId(drHst);
            const hst = this.parseHaltestelle(drHst);

            if (id && hst) {
                hstList.set(id, hst);
            }
        }

        return hstList;
    }


    private static parseHaltestelleId(drHst: NovaDrSchemaHaltestelle): string {
        return drHst['@_id'];
    }


    private static parseHaltestelle(drHst: NovaDrSchemaHaltestelle): Haltestelle {
        const drHstVer = drHst.version;

        if (!drHstVer || !drHstVer.uic || !drHstVer.yKoordinate || !drHstVer.xKoordinate) {
            return undefined;
        }

        return new Haltestelle(
            parseInt(drHstVer.uic, 10),
            drHstVer.bavName,
            Position2d.fromChLv03(
                parseInt(drHstVer.yKoordinate, 10),
                parseInt(drHstVer.xKoordinate, 10)
            )
        );
    }
}
