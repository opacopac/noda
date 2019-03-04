import {Haltestelle} from './haltestelle';
import {Kante} from './kante';
import {Zone} from './zone';
import {Zonenplan} from './zonenplan';
import {KanteWithZonen} from '../ol-components/OlHelper';


export class HstKanteZoneHelper {
    public static addUniqueKante(hstList: Haltestelle[], kante: Kante) {
        this.addUniqueHst(hstList, kante.haltestelle1);
        this.addUniqueHst(hstList, kante.haltestelle2);
    }


    public static addUniqueHst(hstList: Haltestelle[], hst: Haltestelle) {
        if (hstList.indexOf(hst) === -1) {
            hstList.push(hst);
        }
    }


    public static getKantenLinkedToNOtherZonen(zone: Zone, zonenplan: Zonenplan, otherZoneCount: number): KanteWithZonen[] {
        return zone.kanten
            .map(kante => new KanteWithZonen(kante, this.getLinkedOtherZonen(kante, zone, zonenplan)))
            .filter(kanteWZonen => kanteWZonen.zonen.length === otherZoneCount);
    }


    private static getLinkedOtherZonen(kante: Kante, zone: Zone, zonenplan: Zonenplan): Zone[] {
        return kante.zonenLut
            .filter(otherZone => otherZone !== zone && zonenplan.zonen.indexOf(otherZone) >= 0);
    }


    private static getCommonHaltestellenList(kantenWithTwoZonen: KanteWithZonen[], zone: Zone, zonenplan: Zonenplan): Haltestelle[] {
        const hstList: Haltestelle[] = [];

        for (let i = 0; i < kantenWithTwoZonen.length; i++) {
            for (let j = i; j < kantenWithTwoZonen.length; j++) {
                if (i === j) {
                    continue;
                }
                const commonHst = this.getCommonHaltestelle(kantenWithTwoZonen[i].kante, kantenWithTwoZonen[j].kante, zone, zonenplan);
                if (commonHst) {
                    this.addUniqueHst(hstList, commonHst);
                }
            }
        }

        return hstList;
    }


    private static getCommonHaltestelle(kante1: Kante, kante2: Kante, zone: Zone, zonenplan: Zonenplan): Haltestelle {
        if ((kante1.haltestelle1 === kante2.haltestelle1 && kante1.haltestelle2 === kante2.haltestelle2) ||
            (kante1.haltestelle1 === kante2.haltestelle2 && kante1.haltestelle2 === kante2.haltestelle1)) {
            return undefined;
        } else if (kante1.haltestelle1 === kante2.haltestelle1 || kante1.haltestelle1 === kante2.haltestelle2) {
            return kante1.haltestelle1;
        } else if (kante1.haltestelle2 === kante2.haltestelle1 || kante1.haltestelle2 === kante2.haltestelle2) {
            return kante1.haltestelle2;
        } else {
            return undefined;
        }
    }
}
