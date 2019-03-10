import {NovaDrSchema, NovaDrSchemaRelationsgebiet} from './NovaDrSchema';
import {Relationsgebiet, RelationsgebietJson} from '../model/relationsgebiet';
import {isArray} from 'util';
import {StringMap} from '../shared/string-map';


export class NovaDrParserRelationsgebiet {
    public static parse(jsonDr: NovaDrSchema, stichdatum): StringMap<Relationsgebiet, RelationsgebietJson> {
        const drRelationsgebietList = jsonDr.datenrelease.subsystemDVModell.relationsgebiete.relationsgebiet;
        const relationsgebietMap = new StringMap<Relationsgebiet, RelationsgebietJson>();

        for (const drRelationsgebiet of drRelationsgebietList) {
            const id = this.parseId(drRelationsgebiet);
            const relationsgebiet = this.parseRelationsgebiet(id, drRelationsgebiet, stichdatum);

            if (id && relationsgebiet) {
                relationsgebietMap.set(id, relationsgebiet);
            }
        }

        return relationsgebietMap;
    }


    private static parseId(drZonenplan: NovaDrSchemaRelationsgebiet): string {
        return drZonenplan['@_id'];
    }


    private static parseRelationsgebiet(
        relGebId: string,
        drRelationsgebiet: NovaDrSchemaRelationsgebiet,
        stichdatum: string
    ): Relationsgebiet {
        if (!drRelationsgebiet.version) {
            return undefined;
        }

        if (!isArray(drRelationsgebiet.version)) {
            drRelationsgebiet.version = [drRelationsgebiet.version as any];
        }

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
