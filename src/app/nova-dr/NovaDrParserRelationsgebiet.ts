import {NovaDrSchema, NovaDrSchemaRelationsgebiet} from './NovaDrSchema';
import {Relationsgebiet} from '../model/relationsgebiet';
import {isArray} from 'util';


export class NovaDrParserRelationsgebiet {
    public static parse(jsonDr: NovaDrSchema, stichdatum): Map<string, Relationsgebiet> {
        const drRelationsgebietList = jsonDr.datenrelease.subsystemDVModell.relationsgebiete.relationsgebiet;
        const relationsgebietMap: Map<string, Relationsgebiet> = new Map<string, Relationsgebiet>();

        for (const drRelationsgebiet of drRelationsgebietList) {
            const id = this.parseId(drRelationsgebiet);
            const relationsgebiet = this.parseRelationsgebiet(drRelationsgebiet, stichdatum);

            if (id && relationsgebiet) {
                relationsgebietMap.set(id, relationsgebiet);
            }
        }

        return relationsgebietMap;
    }


    private static parseId(drZonenplan: NovaDrSchemaRelationsgebiet): string {
        return drZonenplan['@_id'];
    }


    private static parseRelationsgebiet(drRelationsgebiet: NovaDrSchemaRelationsgebiet, stichdatum: string): Relationsgebiet {
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
                parseInt(drRelationsgebietVer.nummer, 10),
                drRelationsgebietVer.bezeichnung
            );
        }

        return undefined;
    }
}
