import {isArray} from 'util';
import {NovaDrSchema, NovaDrSchemaRtmRelation} from './NovaDrSchema';
import {Relationsgebiet, RelationsgebietJson} from '../model/relationsgebiet';
import {Haltestelle, HaltestelleJson} from '../model/haltestelle';
import {StringMapSer} from '../shared/string-map-ser';
import {NovaDrParserHelper} from './NovaDrParserHelper';


export class NovaDrParserRelation {
    public static parse(
        jsonDr: NovaDrSchema,
        stichdatum: string,
        hstMap: StringMapSer<Haltestelle, HaltestelleJson>,
        relationsgebietMap: StringMapSer<Relationsgebiet, RelationsgebietJson>
    ) {
        const drRelationList = jsonDr.datenrelease.subsystemDVModell.rtmRelationen.rtmRelation;

        for (const drRelations of drRelationList) {
            const id = NovaDrParserHelper.parseIdAttribute(drRelations);
            const relationsgebiet = this.parseRelation(id, drRelations, stichdatum, hstMap, relationsgebietMap);

            if (id && relationsgebiet) {
                relationsgebietMap.set(id, relationsgebiet);
            }
        }

        return relationsgebietMap;
    }


    private static parseRelation(
        relationId: string,
        drRelation: NovaDrSchemaRtmRelation,
        stichdatum: string,
        hstMap: StringMapSer<Haltestelle, HaltestelleJson>,
        relationsgebietMap: StringMapSer<Relationsgebiet, RelationsgebietJson>
    ) {
        if (!drRelation.version) {
            return undefined;
        }

        for (const drRelationVer of NovaDrParserHelper.asArray(drRelation.version)) {
            if (!drRelationVer) {
                continue;
            }

            if (stichdatum < drRelationVer['@_gueltigVon'] || stichdatum > drRelationVer['@_gueltigBis']) {
                continue;
            }

            const relKey = isArray(drRelationVer.relationsschluessel) ?
                drRelationVer.relationsschluessel[0] : [drRelationVer.relationsschluessel as any][0];
            if (!relKey || !relKey['@_type'] || !relKey['@_type'].endsWith('AtomicRelationsschluessel')) {
                continue;
            }

            const relationsgebiet = relationsgebietMap.get(drRelationVer.relationsgebiet);
            const hst1 = hstMap.get(drRelationVer.haltestelle1);
            const hst2 = hstMap.get(drRelationVer.haltestelle2);

            if (!hst1 || !hst2) {
                continue;
            }

            relationsgebiet.atomicKantenLut.push([hst1, hst2]);

            // HstKanteZoneHelper.addUniqueHst(relationsgebiet.haltestellenLut, hst1);
            // HstKanteZoneHelper.addUniqueHst(relationsgebiet.haltestellenLut, hst2);
        }

        return undefined;
    }
}
