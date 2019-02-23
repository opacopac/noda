import {Haltestelle} from '../model/haltestelle';
import {Position2d} from '../geo/position-2d';
import {NovaDrSchemaHaltestelle} from './NovaDrSchema';


export class DrMapperHaltestelle {
    public static createHaltestelleFromJson(drHst: NovaDrSchemaHaltestelle): Haltestelle {
        const drHstVer = drHst.version;
        return new Haltestelle(
            undefined,
            drHstVer.uic,
            drHstVer.bavName,
            Position2d.fromChLv03(drHstVer.yKoordinate, drHstVer.xKoordinate)
        );
    }
}
