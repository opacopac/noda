import VectorLayer from 'ol/layer';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlColorHelper} from './OlColorHelper';
import {Interbereich} from '../model/interbereich';
import {OlAnkerpunkt} from './OlAnkerpunkt';
import {OlFeatureHelper} from './OlFeatureHelper';


export class OlInterbereich {
    public static draw(interbereich: Interbereich, layer: VectorLayer) {
        const olFeature = OlFeatureHelper.createFeature(interbereich);
        olFeature.setStyle(OlInterbereich.createHstPolygonStyle(interbereich));
        OlFeatureHelper.setMultiPolygonGeometry(olFeature, interbereich.hstPolygon);
        layer.getSource().addFeature(olFeature);

        const olFeatureBorder = OlFeatureHelper.createFeature(interbereich);
        olFeatureBorder.setStyle(OlInterbereich.createOuterPolygonStyle(interbereich));
        OlFeatureHelper.setMultiPolygonGeometry(olFeatureBorder, interbereich.polygon);
        layer.getSource().addFeature(olFeatureBorder);

        interbereich.ankerpunkte.forEach(ankerpunkt => OlAnkerpunkt.draw(ankerpunkt, layer));
    }


    private static createHstPolygonStyle(interbereich: Interbereich): Style {
        const colorHex = '#FF6666';
        const colorHexBg = '#FFFFFF';
        return new Style({
            fill: new Fill({
                color: OlColorHelper.getRgbaFromHex(colorHex, 0.5)
            }),
            stroke: new Stroke({
                color: OlColorHelper.getRgbaFromHex(colorHexBg, 0.2),
                width: 1,
            }),
        });
    }


    private static createOuterPolygonStyle(interbereich: Interbereich): Style {
        const colorHex = '#FF6666';
        const colorHexBg = '#FFFFFF';
        return new Style({
            stroke: new Stroke({
                color: OlColorHelper.getRgbaFromHex(colorHex, 0.8),
                width: 3,
            }),
            text: new Text({
                font: 'bold 18px Calibri,sans-serif',
                text: interbereich.name,
                fill: new Fill({ color: colorHex, }),
                stroke: new Stroke({ color: colorHexBg, width: 2 }),
            })
        });
    }
}
