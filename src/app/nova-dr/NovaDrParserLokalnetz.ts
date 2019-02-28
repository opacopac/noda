import {NovaDrSchema, NovaDrSchemaLokalnetz} from './NovaDrSchema';
import {Kante} from '../model/kante';
import {isArray} from 'util';
import {Lokalnetz} from '../model/lokalnetz';


export class NovaDrParserLokalnetz {
    public static parseLokalnetzList(jsonDr: NovaDrSchema, stichdatum: string, kanteMap: Map<string, Kante>): Map<string, Lokalnetz> {
        const drLokalnetzList = jsonDr.datenrelease.subsystemZonenModell.lokalnetzen.lokalnetz;
        const lokalnetzMap: Map<string, Lokalnetz> = new Map<string, Lokalnetz>();

        for (const drLokalnetz of drLokalnetzList) {
            const id = this.parseLokalnetzId(drLokalnetz);
            const lokalnetz = this.parseLokalnetz(drLokalnetz, stichdatum, kanteMap);

            if (id && lokalnetz) {
                lokalnetzMap.set(id, lokalnetz);
            }
        }

        return lokalnetzMap;
    }


    private static parseLokalnetzId(drLokalnetz: NovaDrSchemaLokalnetz): string {
        return drLokalnetz['@_id'];
    }


    private static parseLokalnetz(drLokalnetz: NovaDrSchemaLokalnetz, stichdatum: string, kantenMap: Map<string, Kante>): Lokalnetz {
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
                parseInt(drLokalnetzVer.code, 10),
                kantenList,
                drLokalnetzVer.bezeichnung
            );
        }

        return undefined;
    }


    private static parseKantenList(idString: string, kantenMap: Map<string, Kante>): Kante[] {
        const kantenIds = idString.split(' ');

        if (kantenIds.length === 0) {
            return undefined;
        }

        return kantenIds
            .map(id => kantenMap.get(id))
            .filter(kante => kante !== undefined);
    }
}
