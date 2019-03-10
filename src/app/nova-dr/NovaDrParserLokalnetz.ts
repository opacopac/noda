import {NovaDrSchema, NovaDrSchemaLokalnetz} from './NovaDrSchema';
import {Kante, KanteJson} from '../model/kante';
import {isArray} from 'util';
import {Lokalnetz} from '../model/lokalnetz';
import {StringMap} from '../shared/string-map';
import {Zone} from '../model/zone';
import {ZoneLikeJson} from '../model/zonelike';


export class NovaDrParserLokalnetz {
    public static parse(jsonDr: NovaDrSchema, stichdatum: string, kanteMap: StringMap<Kante, KanteJson>): StringMap<Lokalnetz, ZoneLikeJson> {
        const drLokalnetzList = jsonDr.datenrelease.subsystemZonenModell.lokalnetzen.lokalnetz;
        const lokalnetzMap = new StringMap<Lokalnetz, ZoneLikeJson>();

        for (const drLokalnetz of drLokalnetzList) {
            const id = this.parseLokalnetzId(drLokalnetz);
            const lokalnetz = this.parseLokalnetz(id, drLokalnetz, stichdatum, kanteMap);

            if (id && lokalnetz) {
                lokalnetzMap.set(id, lokalnetz);
            }
        }

        return lokalnetzMap;
    }


    private static parseLokalnetzId(drLokalnetz: NovaDrSchemaLokalnetz): string {
        return drLokalnetz['@_id'];
    }


    private static parseLokalnetz(lokalnetzId: string, drLokalnetz: NovaDrSchemaLokalnetz, stichdatum: string, kantenMap: StringMap<Kante, KanteJson>): Lokalnetz {
        if (!drLokalnetz.version) {
            return undefined;
        }

        if (!isArray(drLokalnetz.version)) {
            drLokalnetz.version = [drLokalnetz.version as any];
        }

        for (const drLokalnetzVer of drLokalnetz.version) {
            if (!drLokalnetzVer || !drLokalnetzVer.kanten) {
                continue;
            }

            if (stichdatum < drLokalnetzVer['@_gueltigVon'] || stichdatum > drLokalnetzVer['@_gueltigBis']) {
                continue;
            }

            const kantenList = this.parseKantenList(drLokalnetzVer.kanten, kantenMap);
            if (!kantenList || kantenList.length === 0) {
                continue;
            }

            return new Lokalnetz(
                lokalnetzId,
                parseInt(drLokalnetzVer.code, 10),
                kantenList,
                drLokalnetzVer.bezeichnung
            );
        }

        return undefined;
    }


    private static parseKantenList(idString: string, kantenMap: StringMap<Kante, KanteJson>): Kante[] {
        const kantenIds = idString.split(' ');

        if (kantenIds.length === 0) {
            return undefined;
        }

        return kantenIds
            .map(id => kantenMap.get(id))
            .filter(kante => kante !== undefined);
    }
}
