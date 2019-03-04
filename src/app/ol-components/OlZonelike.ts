import Vector from 'ol/source';
import Feature from 'ol/Feature';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Zonenplan} from '../model/zonenplan';
import {Zonelike} from '../model/zonelike';
import {OlHelper} from './OlHelper';
import {Position2d} from '../geo/position-2d';
import {Haltestelle} from '../model/haltestelle';
import {DataItemType} from '../model/data-item-type';
import {HstKanteZoneHelper} from '../model/hst-kante-zone-helper';


export class OlZonelike extends OlComponentBase {
    private readonly olFeature: Feature;


    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        zonelike: Zonelike,
        zonenplan: Zonenplan,
        private readonly source: Vector) {

        super();

        this.olFeature = this.createFeature(zonelike);
        this.olFeature.setStyle(this.createStyle(zonelike));
        const hstPolyList = zonelike.getType() === DataItemType.Zone ?
            this.getHstPolygonListFromZone(zonelike, zonenplan) : this.getHstPolygonListFromLokalnetz(zonelike);
        this.setMultiPolygonGeometry(this.olFeature, hstPolyList);
        this.source.addFeature(this.olFeature);
    }


    private createStyle(zonelike: Zonelike): Style {
        const colorIdx = zonelike.code % 10;
        return new Style({
            fill: new Fill({
                color: OlHelper.getRgbaFromColorIndex(colorIdx, 0.5)
            }),
            stroke: new Stroke({
                color: 'rgba(255, 255, 255, 0.2)', // this.getRgbaFromColorIndex(zone, 0.1),
                width: 1,
            }),
            text: new Text({
                font: 'bold 18px Calibri,sans-serif',
                text: zonelike.code.toString(),
                fill: new Fill({ color: OlHelper.getRgbaFromColorIndex(colorIdx, 1.0) }),
                stroke: new Stroke({ color: '#FFFFFF', width: 2 }),
            })
        });
    }


    private getHstPolygonListFromZone(zonelike: Zonelike, zonenplan: Zonenplan): Position2d[][] {
        const hstList: Haltestelle[] = [];

        const kantenWithOneZone = HstKanteZoneHelper.getKantenLinkedToNOtherZonen(zonelike, zonenplan, 0);
        kantenWithOneZone.forEach(kanteWzonen => HstKanteZoneHelper.addUniqueKante(hstList, kanteWzonen.kante));

        /*const kantenWithTwoZonen = this.getKantenLinkedToNOtherZonen(zone, zonenplan, 1);
        const commonHst = this.getCommonHaltestellenList(kantenWithTwoZonen, zone, zonenplan);
        commonHst.forEach(hst => this.addUniqueHst(hstList, hst));*/

        return hstList.map(hst => hst.polygon);
    }


    private getHstPolygonListFromLokalnetz(zonelike: Zonelike): Position2d[][] {
        const hstList: Haltestelle[] = [];

        zonelike.kanten.forEach(kante => HstKanteZoneHelper.addUniqueKante(hstList, kante));

        return hstList.map(hst => hst.polygon);
    }
}
