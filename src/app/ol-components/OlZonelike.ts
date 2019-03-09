import Vector from 'ol/source';
import Feature from 'ol/Feature';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Zonenplan} from '../model/zonenplan';
import {Zonelike} from '../model/zonelike';
import {OlHelper} from './OlHelper';


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
        this.olFeatureInner.setStyle(this.createHstPolygonStyle(zonelike));
        this.setMultiPolygonGeometry(this.olFeatureInner, zonelike.hstPolygon);
        this.source.addFeature(this.olFeatureInner);

        this.olFeatureBorder = this.createFeature(zonelike);
        this.olFeatureBorder.setStyle(this.createOuterPolygonStyle(zonelike));
        this.setMultiPolygonGeometry(this.olFeatureBorder, zonelike.polygon);
        this.source.addFeature(this.olFeatureBorder);
    }


    private createHstPolygonStyle(zonelike: Zonelike): Style {
        const colorIdx = zonelike.code % 10;
        const colorHexBg = '#FFFFFF';
        return new Style({
            fill: new Fill({
                // color: OlHelper.getRgbaFromColorIndex(colorIdx, 0.5)
                color: OlHelper.getRgbaFromVerbundZone(zonelike.zonenplan.bezeichnung, zonelike.code, 0.75)
            }),
            stroke: new Stroke({
                color: OlHelper.getRgbaFromHex(colorHexBg, 0.2),
                width: 1,
            }),
        });
    }


    private createOuterPolygonStyle(zonelike: Zonelike): Style {
        const colorIdx = zonelike.code % 10;
        const colorHexBg = '#FFFFFF';
        let text = zonelike.code.toString();
        if (zonelike.bezeichnung && zonelike.bezeichnung.length > 0) {
            text += '\n' + zonelike.bezeichnung;
        }
        return new Style({
            stroke: new Stroke({
                // color: OlHelper.getRgbaFromColorIndex(colorIdx, 0.8),
                color: OlHelper.getRgbaFromVerbundZone(zonelike.zonenplan.bezeichnung, zonelike.code, 0.9),
                width: 3,
            }),
            text: new Text({
                font: 'bold 18px Calibri,sans-serif',
                text: text,
                fill: new Fill({
                    // color: OlHelper.getRgbaFromColorIndex(colorIdx, 1.0)
                    // color: OlHelper.getRgbaFromVerbundZone(zonelike.zonenplan.bezeichnung, zonelike.code, 1.0)
                    color: '#000000'
                }),
                stroke: new Stroke({ color: colorHexBg, width: 2 }),
            })
        });
    }
}
