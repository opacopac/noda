import {NovaDrSchema, NovaDrSchemaKante} from './NovaDrSchema';
import {Haltestelle, HaltestelleJson} from '../model/haltestelle';
import {Kante, KanteJson, VerkehrsmittelTyp} from '../model/kante';
import {isArray} from 'util';
import {StringMap} from '../shared/string-map';


export class NovaDrParserKante {
    public static parse(
        jsonDr: NovaDrSchema,
        stichdatum: string,
        hstMap: StringMap<Haltestelle, HaltestelleJson>
    ): StringMap<Kante, KanteJson> {
        const drKanteList = jsonDr.datenrelease.subsystemNetz.kanten.kante;
        const kanteMap: StringMap<Kante, KanteJson> = new StringMap<Kante, KanteJson>();

        for (const drKante of drKanteList) {
            const id = this.parseKanteId(drKante);
            const kante = this.parseKante(id, drKante, stichdatum, hstMap);

            if (id && kante) {
                kanteMap.set(id, kante);
            }
        }

        return kanteMap;
    }


    private static parseKanteId(drKante: NovaDrSchemaKante): string {
        return drKante['@_id'];
    }


    private static parseKante(
        kanteId: string,
        drKante: NovaDrSchemaKante,
        stichdatum: string,
        hstMap: StringMap<Haltestelle, HaltestelleJson>
    ): Kante {
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
                kanteId,
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
