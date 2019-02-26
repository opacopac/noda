import Vector from 'ol/source';
import Feature from 'ol/Feature';
import {Style, Icon, Fill, Circle, Text, Stroke} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Zone} from '../model/zone';
import {Position2d} from '../geo/position-2d';
import {Haltestelle} from '../model/haltestelle';
import {Kante} from '../model/kante';
import {Zonenplan} from '../model/zonenplan';


class KanteWithZonen {
    constructor(
        public kante: Kante,
        public zonen: Zone[]
    ) {}
}


export class OlZone extends OlComponentBase {
    private readonly olFeature: Feature;
    private readonly colorList = [
        '#e6194B',
        '#f58231',
        '#ffe119',
        '#bfef45',
        '#3cb44b',
        '#42d4f4',
        '#4363d8',
        '#911eb4',
        '#f032e6',
        '#800000',
        '#9A6324',
        '#808000',
        '#000075',
    ];

    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        zone: Zone,
        zonenplan: Zonenplan,
        private readonly source: Vector) {

        super();

        this.olFeature = this.createFeature(zone);
        this.olFeature.setStyle(this.createStyle(zone));
        const hstPolyList = this.getHstPolygonList(zone, zonenplan);
        this.setMultiPolygonGeometry(this.olFeature, hstPolyList);
        this.source.addFeature(this.olFeature);
    }


    private createStyle(zone: Zone): Style {
        return new Style({
            fill: new Fill({
                color: this.getColorString(zone, 0.3)
            }),
            stroke: new Stroke({
                color: 'rgba(255, 255, 255, 0.2)', // this.getColorString(zone, 0.1),
                width: 1,
            }),
            text: new Text({
                font: 'bold 24px Calibri,sans-serif',
                text: zone.code.toString(),
                fill: new Fill({ color: this.getColorString(zone, 1.0) }),
                stroke: new Stroke({ color: '#FFFFFF', width: 3 }),
            })
        });
    }


    private getColorString(zone: Zone, opacity: number): string {
        const index = zone.code % 10; //  this.colorList.length;
        const colorHex = this.colorList[index];

        return 'rgba(' +
            this.getDecFromHex(colorHex.substr(1, 2)) + ',' +
            this.getDecFromHex(colorHex.substr(3, 2)) + ',' +
            this.getDecFromHex(colorHex.substr(5, 2)) + ',' +
            opacity + ')';
    }


    private getDecFromHex(colorHex: string): number {
        return parseInt(colorHex, 16);
    }


    private getHstPolygonList(zone: Zone, zonenplan: Zonenplan): Position2d[][] {
        const hstList: Haltestelle[] = [];

        const kantenWithOneZone = this.getKantenLinkedToNOtherZonen(zone, zonenplan, 0);
        kantenWithOneZone.forEach(kanteWzonen => this.addUniqueKante(hstList, kanteWzonen.kante));

        /*const kantenWithTwoZonen = this.getKantenLinkedToNOtherZonen(zone, zonenplan, 1);
        const commonHst = this.getCommonHaltestellenList(kantenWithTwoZonen, zone, zonenplan);
        commonHst.forEach(hst => this.addUniqueHst(hstList, hst));*/

        return hstList.map(hst => hst.polygon);
    }


    private addUniqueKante(hstList: Haltestelle[], kante: Kante) {
        this.addUniqueHst(hstList, kante.haltestelle1);
        this.addUniqueHst(hstList, kante.haltestelle2);
    }


    private addUniqueHst(hstList: Haltestelle[], hst: Haltestelle) {
        if (hstList.indexOf(hst) === -1) {
            hstList.push(hst);
        }
    }


    private getKantenLinkedToNOtherZonen(zone: Zone, zonenplan: Zonenplan, otherZoneCount: number): KanteWithZonen[] {
        return zone.kanten
            .map(kante => new KanteWithZonen(kante, this.getLinkedOtherZonen(kante, zone, zonenplan)))
            .filter(kanteWZonen => kanteWZonen.zonen.length === otherZoneCount);
    }


    private getLinkedOtherZonen(kante: Kante, zone: Zone, zonenplan: Zonenplan): Zone[] {
        return kante.zonenLut
            .filter(otherZone => otherZone !== zone && zonenplan.zonen.indexOf(otherZone) >= 0);
    }


    private getCommonHaltestellenList(kantenWithTwoZonen: KanteWithZonen[], zone: Zone, zonenplan: Zonenplan): Haltestelle[] {
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


    private getCommonHaltestelle(kante1: Kante, kante2: Kante, zone: Zone, zonenplan: Zonenplan): Haltestelle {
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
