import {Haltestelle} from '../model/haltestelle';
import {Position2d} from '../geo/position-2d';
import {NovaDrSchemaHaltestelle} from './NovaDrSchema';


export class DrMapperHaltestelle {
    public static createHaltestelleFromJson(drHst: NovaDrSchemaHaltestelle): Haltestelle {
        const drHstVer = drHst.version;

        if (!drHstVer || !drHstVer.uic || !drHstVer.yKoordinate || !drHstVer.xKoordinate) {
            return undefined;
        }

        return new Haltestelle(
            undefined,
            drHstVer.uic,
            drHstVer.bavName,
            Position2d.fromChLv03(drHstVer.yKoordinate, drHstVer.xKoordinate)
        );
    }
}
