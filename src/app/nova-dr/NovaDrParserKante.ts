import {NovaDrSchema, NovaDrSchemaKante} from './NovaDrSchema';
import {Haltestelle} from '../model/haltestelle';
import {Kante} from '../model/kante';


export class NovaDrParserKante {
    public static parseKanteList(jsonDr: NovaDrSchema, hstMap: Map<string, Haltestelle>): Map<string, Kante> {
        const drKanteList = jsonDr.datenrelease.subsystemNetz.kanten.kante;
        const kanteMap: Map<string, Kante> = new Map<string, Kante>();

        for (const drKante of drKanteList) {
            const id = this.parseKanteId(drKante);
            const kante = this.parseKante(drKante, hstMap);

            if (id && kante) {
                kanteMap.set(id, kante);
            }
        }

        return kanteMap;
    }


    private static parseKanteId(drKante: NovaDrSchemaKante): string {
        return drKante['@_id'];
    }


    private static parseKante(drKante: NovaDrSchemaKante, hstMap: Map<string, Haltestelle>): Kante {
        const drKanteVer = drKante.version;

        if (!drKanteVer || !drKanteVer.haltestelle1 || !drKanteVer.haltestelle2) {
            return undefined;
        }

        const hst1 = hstMap.get(drKanteVer.haltestelle1);
        const hst2 = hstMap.get(drKanteVer.haltestelle2);

        if (!hst1 || !hst2) {
            return undefined;
        }

        return new Kante(
            hst1,
            hst2,
            drKanteVer.verkehrsmittelTyp
        );
    }
}
