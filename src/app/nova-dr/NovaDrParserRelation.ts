import {isArray} from 'util';
import {NovaDrSchema, NovaDrSchemaRtmRelation, NovaDrSchemaRtmRelationsSchluessel} from './NovaDrSchema';
import {Relationsgebiet} from '../model/relationsgebiet';
import {HstKanteZoneHelper} from '../model/hst-kante-zone-helper';
import {Haltestelle} from '../model/haltestelle';


export class NovaDrParserRelation {
    public static parse(jsonDr: NovaDrSchema, stichdatum, hstMap: Map<string, Haltestelle>, relationsgebietMap: Map<string, Relationsgebiet>) {
        const drRelationList = jsonDr.datenrelease.subsystemDVModell.rtmRelationen.rtmRelation;

        for (const drRelations of drRelationList) {
            const id = this.parseId(drRelations);
            const relationsgebiet = this.parseRelationsgebiet(drRelations, stichdatum, hstMap, relationsgebietMap);

            if (id && relationsgebiet) {
                relationsgebietMap.set(id, relationsgebiet);
            }
        }

        return relationsgebietMap;
    }


    private static parseId(drRelation: NovaDrSchemaRtmRelation): string {
        return drRelation['@_id'];
    }


    private static parseRelationsgebiet(drRelation: NovaDrSchemaRtmRelation, stichdatum: string, hstMap: Map<string, Haltestelle>, relationsgebietMap: Map<string, Relationsgebiet>) {
        if (!drRelation.version) {
            return undefined;
        }

        if (!isArray(drRelation.version)) {
            drRelation.version = [drRelation.version as any];
        }

        for (const drRelationVer of drRelation.version) {
            if (!drRelationVer) {
                continue;
            }

            if (stichdatum < drRelationVer['@_gueltigVon'] || stichdatum > drRelationVer['@_gueltigBis']) {
                continue;
            }

            const relKey = isArray(drRelationVer.relationsschluessel) ? drRelationVer.relationsschluessel[0] : [drRelationVer.relationsschluessel as any][0];
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
