import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {Zonelike} from '../model/zonelike';
import {OlColorHelper} from './OlColorHelper';
import {OlFeatureHelper} from './OlFeatureHelper';


export class OlZonelike {
    public static drawFilling(zonelike: Zonelike, layer: VectorLayer) {
        const olFeatureInner = OlFeatureHelper.createFeature(zonelike);
        olFeatureInner.setStyle(OlZonelike.createHstPolygonStyle(zonelike));
        OlFeatureHelper.setMultiPolygonGeometry(olFeatureInner, zonelike.hstPolygon);
        layer.getSource().addFeature(olFeatureInner);
    }


    public static drawOutline(zonelike: Zonelike, layer: VectorLayer) {
        const olFeatureBorder = OlFeatureHelper.createFeature(zonelike);
        olFeatureBorder.setStyle(OlZonelike.createOuterPolygonStyle(zonelike));
        OlFeatureHelper.setMultiPolygonGeometry(olFeatureBorder, zonelike.polygon);
        layer.getSource().addFeature(olFeatureBorder);
    }


    public static drawSelection(zonelike: Zonelike, layer: VectorLayer) {
        const olFeature = new Feature();
        olFeature.setStyle(this.createSelectionStyle(zonelike));
        OlFeatureHelper.setMultiPolygonGeometry(olFeature, zonelike.polygon);
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


    private static createHstPolygonStyle(zonelike: Zonelike): Style {
        const colorHexBg = '#FFFFFF';
        return new Style({
            fill: new Fill({
                color: OlColorHelper.getRgbaFromVerbundZone(zonelike.zonenplan.bezeichnung, zonelike.code, 0.6)
            }),
            stroke: new Stroke({
                color: OlColorHelper.getRgbaFromHex(colorHexBg, 0.2),
                width: 1,
            }),
        });
    }


    private static createOuterPolygonStyle(zonelike: Zonelike): Style {
        const colorHexBg = '#FFFFFF';
        let text = zonelike.code.toString();
        if (zonelike.bezeichnung && zonelike.bezeichnung.length > 0) {
            text += '\n' + zonelike.bezeichnung;
        }
        return new Style({
            stroke: new Stroke({
                color: OlColorHelper.getRgbaFromVerbundZone(zonelike.zonenplan.bezeichnung, zonelike.code, 0.9),
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
