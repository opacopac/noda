import {NovaDrSchema, NovaDrSchemaHaltestelle} from './NovaDrSchema';
import {Haltestelle, HaltestelleJson} from '../model/haltestelle';
import {Position2d} from '../geo/position-2d';
import {StringMapSer} from '../shared/string-map-ser';
import {NovaDrParserHelper} from './NovaDrParserHelper';


export class NovaDrParserHaltestelle {
    public static parse(jsonDr: NovaDrSchema, stichdatum: string): StringMapSer<Haltestelle, HaltestelleJson> {
        const drHstList = jsonDr.datenrelease.subsystemNetz.haltestellen.haltestelle;
        const hstList: StringMapSer<Haltestelle, HaltestelleJson> = new StringMapSer<Haltestelle, HaltestelleJson>();

        for (const drHst of drHstList) {
            const id = NovaDrParserHelper.parseIdAttribute(drHst);
            const hst = this.parseHaltestelle(id, drHst, stichdatum);

            if (id && hst) {
                hstList.set(id, hst);
            }
        }

        return hstList;
    }


    private static parseHaltestelle(hstId: string, drHst: NovaDrSchemaHaltestelle, stichdatum: string): Haltestelle {
        if (!drHst.version) {
            return undefined;
        }

        for (const drHstVer of NovaDrParserHelper.asArray(drHst.version)) {
            if (!drHstVer || !drHstVer.uic || !drHstVer.yKoordinate || !drHstVer.xKoordinate) {
                continue;
            }

            if (stichdatum < drHstVer['@_gueltigVon'] || stichdatum > drHstVer['@_gueltigBis']) {
                continue;
            }

            return new Haltestelle(
                hstId,
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
