import {NovaDrSchemaRelationsgebiet} from './NovaDrSchema';
import {Relationsgebiet, RelationsgebietJson} from '../model/relationsgebiet';
import {StringMapSer} from '../shared/string-map-ser';
import {NovaDrParserHelper} from './NovaDrParserHelper';


export class NovaDrParserRelationsgebiet {
    public static parse(drRelationsgebietList: NovaDrSchemaRelationsgebiet[], stichdatum): StringMapSer<Relationsgebiet, RelationsgebietJson> {
        const relationsgebietMap = new StringMapSer<Relationsgebiet, RelationsgebietJson>();

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

        for (const drRelationsgebietVer of NovaDrParserHelper.asArray(drRelationsgebiet.version)) {
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
