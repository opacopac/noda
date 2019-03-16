import {NovaDrSchema, NovaDrSchemaKante} from './NovaDrSchema';
import {Haltestelle, HaltestelleJson} from '../model/haltestelle';
import {Kante, KanteJson, VerkehrsmittelTyp} from '../model/kante';
import {StringMap, StringMapSer} from '../shared/string-map-ser';
import {NovaDrParserHelper} from './NovaDrParserHelper';
import {Verwaltung} from '../model/verwaltung';


export class NovaDrParserKante {
    public static parse(
        jsonDr: NovaDrSchema,
        stichdatum: string,
        hstMap: StringMapSer<Haltestelle, HaltestelleJson>,
        verwaltungMap: StringMap<Verwaltung>
    ): StringMapSer<Kante, KanteJson> {
        const drKanteList = jsonDr.datenrelease.subsystemNetz.kanten.kante;
        const kanteMap: StringMapSer<Kante, KanteJson> = new StringMapSer<Kante, KanteJson>();

        for (const drKante of drKanteList) {
            const id = NovaDrParserHelper.parseIdAttribute(drKante);
            const kante = this.parseKante(id, drKante, stichdatum, hstMap, verwaltungMap);

            if (id && kante) {
                kanteMap.set(id, kante);
            }
        }

        return kanteMap;
    }


    private static parseKante(
        kanteId: string,
        drKante: NovaDrSchemaKante,
        stichdatum: string,
        hstMap: StringMapSer<Haltestelle, HaltestelleJson>,
        verwaltungMap: StringMap<Verwaltung>
    ): Kante {
        if (!drKante.version) {
            return undefined;
        }

        for (const drKanteVer of NovaDrParserHelper.asArray(drKante.version)) {
            if (!drKanteVer || !drKanteVer.haltestelle1 || !drKanteVer.haltestelle2) {
                continue;
            }

            if (stichdatum < drKanteVer['@_gueltigVon'] || stichdatum > drKanteVer['@_gueltigBis']) {
                continue;
            }

            const hst1 = hstMap.get(drKanteVer.haltestelle1);
            const hst2 = hstMap.get(drKanteVer.haltestelle2);
            const verwaltung = verwaltungMap.get(drKanteVer.verwaltung);

            if (!hst1 || !hst2) {
                continue;
            }

            return new Kante(
                kanteId,
                hst1,
                hst2,
                this.parseVerkehrsmittelTpy(drKanteVer),
                verwaltung && verwaltung.betreiber ? verwaltung.betreiber.abkuerzung : ''
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
