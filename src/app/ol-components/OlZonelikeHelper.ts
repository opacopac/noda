import {Style, Icon, Fill, Circle, Text, Stroke} from 'ol/style';
import {Zone} from '../model/zone';
import {Haltestelle} from '../model/haltestelle';
import {Kante} from '../model/kante';
import {Zonenplan} from '../model/zonenplan';
import {Zonelike} from '../model/zonelike';


export class KanteWithZonen {
    constructor(
        public kante: Kante,
        public zonen: Zone[]
    ) {}
}


export class OlZonelikeHelper {
    private static readonly colorList = [
        '#e6194B',
        '#f58231',
        '#ffe119',
        // '#bfef45',
        '#3cb44b',
        '#42d4f4',
        '#4363d8',
        // '#911eb4',
        '#f032e6',
        '#800000',
        '#9A6324',
        // '#808000',
        '#000075',
    ];

    public static getColorString(zonelike: Zonelike, opacity: number): string {
        const index = zonelike.code % 10; //  this.colorList.length;
        const colorHex = this.colorList[index];

        return 'rgba(' +
            this.getDecFromHex(colorHex.substr(1, 2)) + ',' +
            this.getDecFromHex(colorHex.substr(3, 2)) + ',' +
            this.getDecFromHex(colorHex.substr(5, 2)) + ',' +
            opacity + ')';
    }


    private static getDecFromHex(colorHex: string): number {
        return parseInt(colorHex, 16);
    }


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
