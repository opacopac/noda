import Vector from 'ol/source';
import Feature from 'ol/Feature';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Zonenplan} from '../model/zonenplan';
import {Zonelike} from '../model/zonelike';
import {OlHelper} from './OlHelper';
import {Haltestelle} from '../model/haltestelle';
import {DataItemType} from '../model/data-item-type';
import {HstKanteZoneHelper} from '../model/hst-kante-zone-helper';
import {Polygon2d} from '../geo/polygon-2d';
import {MultiPolygon2d} from '../geo/multi-polygon-2d';


export class OlZonelike extends OlComponentBase {
    private readonly olFeatureInner: Feature;
    private readonly olFeatureBorder: Feature;


    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        zonelike: Zonelike,
        zonenplan: Zonenplan,
        private readonly source: Vector) {

        super();

        this.olFeatureInner = this.createFeature(zonelike);
        this.olFeatureInner.setStyle(this.createStyle(zonelike));
        const hstMultiPolygon = zonelike.getType() === DataItemType.Zone ?
            this.getHstPolygonListFromZone(zonelike) : this.getHstPolygonListFromLokalnetz(zonelike);
        this.setMultiPolygonGeometry(this.olFeatureInner, hstMultiPolygon);
        this.source.addFeature(this.olFeatureInner);

        this.olFeatureBorder = this.createFeature(zonelike);
        this.olFeatureBorder.setStyle(this.createBorderStyle(zonelike));
        this.setMultiPolygonGeometry(this.olFeatureBorder, zonelike.polygon);
        this.source.addFeature(this.olFeatureBorder);
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
        });
    }


    private createBorderStyle(zonelike: Zonelike): Style {
        const colorIdx = zonelike.code % 10;
        return new Style({
            stroke: new Stroke({
                color: OlHelper.getRgbaFromColorIndex(colorIdx, 0.8),
                width: 3,
            }),
            text: new Text({
                font: 'bold 18px Calibri,sans-serif',
                text: zonelike.code.toString(),
                fill: new Fill({ color: OlHelper.getRgbaFromColorIndex(colorIdx, 1.0) }),
                stroke: new Stroke({ color: '#FFFFFF', width: 2 }),
            })
        });
    }


    private getHstPolygonListFromZone(zonelike: Zonelike): MultiPolygon2d {
        const hstList: Haltestelle[] = [];

        const kantenWithOneZone = HstKanteZoneHelper.getKantenLinkedToNOtherZonen(zonelike, 0);
        kantenWithOneZone.forEach(kanteWzonen => HstKanteZoneHelper.addUniqueKantenHst(hstList, kanteWzonen.kante));

        /*const kantenWithTwoZonen = this.getKantenLinkedToNOtherZonen(zone, zonenplan, 1);
        const commonHst = this.getCommonHaltestellenList(kantenWithTwoZonen, zone, zonenplan);
        commonHst.forEach(hst => this.addUniqueHst(hstList, hst));*/

        return new MultiPolygon2d(hstList.map(hst => new Polygon2d(hst.ring)));
    }


    private getHstPolygonListFromLokalnetz(zonelike: Zonelike): MultiPolygon2d {
        const hstList: Haltestelle[] = [];

        zonelike.kanten.forEach(kante => HstKanteZoneHelper.addUniqueKantenHst(hstList, kante));

        return new MultiPolygon2d(hstList.map(hst => new Polygon2d(hst.ring)));
    }
}
