import {NovaDrSchema, NovaDrSchemaRelationsgebiet} from './NovaDrSchema';
import {Relationsgebiet, RelationsgebietJson} from '../model/relationsgebiet';
import {StringMap} from '../shared/string-map';
import {NovaDrParserHelper} from './NovaDrParserHelper';


export class NovaDrParserRelationsgebiet {
    public static parse(jsonDr: NovaDrSchema, stichdatum): StringMap<Relationsgebiet, RelationsgebietJson> {
        const drRelationsgebietList = jsonDr.datenrelease.subsystemDVModell.relationsgebiete.relationsgebiet;
        const relationsgebietMap = new StringMap<Relationsgebiet, RelationsgebietJson>();

        for (const drRelationsgebiet of drRelationsgebietList) {
            const id = NovaDrParserHelper.parseIdAttribute(drRelationsgebiet);
            const relationsgebiet = this.parseRelationsgebiet(id, drRelationsgebiet, stichdatum);

            if (id && relationsgebiet) {
                relationsgebietMap.set(id, relationsgebiet);
            }
        }

        return relationsgebietMap;
    }


    private static parseRelationsgebiet(
        relGebId: string,
        drRelationsgebiet: NovaDrSchemaRelationsgebiet,
        stichdatum: string
    ): Relationsgebiet {
        if (!drRelationsgebiet.version) {
            return undefined;
        }

        drRelationsgebiet.version = NovaDrParserHelper.asArray(drRelationsgebiet.version);

        for (const drRelationsgebietVer of drRelationsgebiet.version) {
            if (!drRelationsgebietVer) {
                continue;
            }

            if (stichdatum < drRelationsgebietVer['@_gueltigVon'] || stichdatum > drRelationsgebietVer['@_gueltigBis']) {
                continue;
            }

            return new Relationsgebiet(
                relGebId,
                parseInt(drRelationsgebietVer.nummer, 10),
                drRelationsgebietVer.bezeichnung
            );
        }

        return undefined;
    }
}
