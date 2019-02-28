import {NovaDrSchema, NovaDrSchemaHaltestelle} from './NovaDrSchema';
import {Haltestelle} from '../model/haltestelle';
import {Position2d} from '../geo/position-2d';
import {isArray} from 'util';


export class NovaDrParserHaltestelle {
    public static parse(jsonDr: NovaDrSchema, stichdatum: string): Map<string, Haltestelle> {
        const drHstList = jsonDr.datenrelease.subsystemNetz.haltestellen.haltestelle;
        const hstList: Map<string, Haltestelle> = new Map<string, Haltestelle>();

        for (const drHst of drHstList) {
            const id = this.parseHaltestelleId(drHst);
            const hst = this.parseHaltestelle(drHst, stichdatum);

            if (id && hst) {
                hstList.set(id, hst);
            }
        }

        return hstList;
    }


    private static parseHaltestelleId(drHst: NovaDrSchemaHaltestelle): string {
        return drHst['@_id'];
    }


    private static parseHaltestelle(drHst: NovaDrSchemaHaltestelle, stichdatum: string): Haltestelle {
        if (!drHst.version) {
            return undefined;
        }

        if (!isArray(drHst.version)) {
            drHst.version = [drHst.version as any];
        }

        for (const drHstVer of drHst.version) {
            if (!drHstVer || !drHstVer.uic || !drHstVer.yKoordinate || !drHstVer.xKoordinate) {
                continue;
            }

            if (stichdatum < drHstVer['@_gueltigVon'] || stichdatum > drHstVer['@_gueltigBis']) {
                continue;
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

        return undefined;
    }
}
