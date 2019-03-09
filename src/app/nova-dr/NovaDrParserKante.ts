import {NovaDrSchema, NovaDrSchemaKante} from './NovaDrSchema';
import {Haltestelle} from '../model/haltestelle';
import {Kante, VerkehrsmittelTyp} from '../model/kante';
import {isArray} from 'util';


export class NovaDrParserKante {
    public static parse(jsonDr: NovaDrSchema, stichdatum: string, hstMap: Map<string, Haltestelle>): Map<string, Kante> {
        const drKanteList = jsonDr.datenrelease.subsystemNetz.kanten.kante;
        const kanteMap: Map<string, Kante> = new Map<string, Kante>();

        for (const drKante of drKanteList) {
            const id = this.parseKanteId(drKante);
            const kante = this.parseKante(drKante, stichdatum, hstMap);

            if (id && kante) {
                kanteMap.set(id, kante);
            }
        }

        return kanteMap;
    }


    private static parseKanteId(drKante: NovaDrSchemaKante): string {
        return drKante['@_id'];
    }


    private static parseKante(drKante: NovaDrSchemaKante, stichdatum: string, hstMap: Map<string, Haltestelle>): Kante {
        if (!drKante.version) {
            return undefined;
        }

        if (!isArray(drKante.version)) {
            drKante.version = [drKante.version as any];
        }

        for (const drKanteVer of drKante.version) {
            if (!drKanteVer || !drKanteVer.haltestelle1 || !drKanteVer.haltestelle2) {
                continue;
            }

            if (stichdatum < drKanteVer['@_gueltigVon'] || stichdatum > drKanteVer['@_gueltigBis']) {
                continue;
            }

            const hst1 = hstMap.get(drKanteVer.haltestelle1);
            const hst2 = hstMap.get(drKanteVer.haltestelle2);

            if (!hst1 || !hst2) {
                continue;
            }

            return new Kante(
                hst1,
                hst2,
                this.parseVerkehrsmittelTpy(drKanteVer)
            );
        }

        return undefined;
    }


    private static parseVerkehrsmittelTpy(drKanteVer): VerkehrsmittelTyp {
        switch (drKanteVer.verkehrsmittelTyp) {
            case 'BUS': return VerkehrsmittelTyp.BUS;
            case 'SCHIFF': return VerkehrsmittelTyp.SCHIFF;
            case 'BAHN': return VerkehrsmittelTyp.BAHN;
            case 'FUSSWEG': return VerkehrsmittelTyp.FUSSWEG;
            default: return VerkehrsmittelTyp.UNKNOWN;
        }
    }
}
