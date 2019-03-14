import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Zonenplan} from '../model/zonenplan';
import {Zonelike} from '../model/zonelike';
import {OlHelper} from './OlHelper';
import {Zone} from '../model/zone';


export class OlZonelike extends OlComponentBase {
    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        zonelike: Zonelike,
        zonenplan: Zonenplan,
        zoneFillingLayer: VectorLayer,
        zoneBorderLayer: VectorLayer) {

        super();

        // filling
        const olFeatureInner = this.createFeature(zonelike);
        olFeatureInner.setStyle(this.createHstPolygonStyle(zonelike));
        this.setMultiPolygonGeometry(olFeatureInner, zonelike.hstPolygon);
        zoneFillingLayer.getSource().addFeature(olFeatureInner);

        // border
        const olFeatureBorder = this.createFeature(zonelike);
        olFeatureBorder.setStyle(this.createOuterPolygonStyle(zonelike));
        this.setMultiPolygonGeometry(olFeatureBorder, zonelike.polygon);
        zoneBorderLayer.getSource().addFeature(olFeatureBorder);
    }


    public static drawSelection(zonelike: Zonelike, layer: VectorLayer) {
        const olFeature = new Feature();
        olFeature.setStyle(this.createSelectionStyle(zonelike));
        this.setMultiPolygonGeometry2(olFeature, zonelike.polygon);
        layer.getSource().addFeature(olFeature);
    }


    private static createSelectionStyle(zonelike: Zonelike): Style {
        return new Style({
            stroke: new Stroke({
                color: '#CC0000',
                width: 3,
            }),
        });
    }


    private createHstPolygonStyle(zonelike: Zonelike): Style {
        const colorHexBg = '#FFFFFF';
        return new Style({
            fill: new Fill({
                color: OlHelper.getRgbaFromVerbundZone(zonelike.zonenplan.bezeichnung, zonelike.code, 0.75)
            }),
            stroke: new Stroke({
                color: OlHelper.getRgbaFromHex(colorHexBg, 0.2),
                width: 1,
            }),
        });
    }


    private createOuterPolygonStyle(zonelike: Zonelike): Style {
        const colorHexBg = '#FFFFFF';
        let text = zonelike.code.toString();
        if (zonelike.bezeichnung && zonelike.bezeichnung.length > 0) {
            text += '\n' + zonelike.bezeichnung;
        }
        return new Style({
            stroke: new Stroke({
                color: OlHelper.getRgbaFromVerbundZone(zonelike.zonenplan.bezeichnung, zonelike.code, 0.9),
                width: 3,
            }),
            text: new Text({
                font: 'bold 18px Calibri,sans-serif',
                text: text,
                fill: new Fill({ color: '#000000' }),
                stroke: new Stroke({ color: colorHexBg, width: 2 }),
            })
        });
    }
}
