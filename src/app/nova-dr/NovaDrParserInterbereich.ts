import {isArray} from 'util';
import {NovaDrSchema, NovaDrSchemaInterbereich} from './NovaDrSchema';
import {Kante} from '../model/kante';
import {Interbereich} from '../model/interbereich';



export class NovaDrParserInterbereich {
    public static parse(jsonDr: NovaDrSchema, stichdatum: string, kanteMap: Map<string, Kante>): Map<string, Interbereich> {
        const drInterbereichList = jsonDr.datenrelease.subsystemInterModell.interBereiche.interBereich;
        const interbereichMap: Map<string, Interbereich> = new Map<string, Interbereich>();

        for (const drInterbereich of drInterbereichList) {
            const id = this.parseId(drInterbereich);
            const interbereich = this.parseInterbereich(drInterbereich, stichdatum, kanteMap);

            if (id && interbereich) {
                interbereichMap.set(id, interbereich);
            }
        }

        return interbereichMap;
    }


    private static parseId(drKante: NovaDrSchemaInterbereich): string {
        return drKante['@_id'];
    }


    private static parseInterbereich(drInterbereich: NovaDrSchemaInterbereich, stichdatum: string, kantenMap: Map<string, Kante>): Interbereich {
        if (!drInterbereich.version) {
            return undefined;
        }

        if (!isArray(drInterbereich.version)) {
            drInterbereich.version = [drInterbereich.version as any];
        }

        for (const drInterbereichVer of drInterbereich.version) {
            if (!drInterbereichVer || !(drInterbereichVer.dvKanten || drInterbereichVer.ivKanten)) {
                continue;
            }

            if (stichdatum < drInterbereichVer['@_gueltigVon'] || stichdatum > drInterbereichVer['@_gueltigBis']) {
                continue;
            }

            const dvKantenList = this.parseKantenList(drInterbereichVer.dvKanten, kantenMap);
            const ivKantenList = this.parseKantenList(drInterbereichVer.ivKanten, kantenMap);
            const kantenList = [...dvKantenList, ...ivKantenList];
            if (!kantenList || kantenList.length === 0) {
                continue;
            }

            return new Interbereich(
                drInterbereichVer.name,
                kantenList
            );
        }

        return undefined;
    }


    private static parseKantenList(idString: string, kantenMap: Map<string, Kante>): Kante[] {
        if (!idString) {
            return [];
        }

        const zonenIds = idString.split(' ');
        if (zonenIds.length === 0) {
            return [];
        }

        return zonenIds
            .map(id => kantenMap.get(id))
            .filter(kante => kante !== undefined);
    }
}
