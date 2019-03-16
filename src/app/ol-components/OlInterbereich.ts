import VectorLayer from 'ol/layer';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {OlHelper} from './OlHelper';
import {Interbereich} from '../model/interbereich';
import {OlAnkerpunkt} from './OlAnkerpunkt';


export class OlInterbereich extends OlComponentBase {
    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        interbereich: Interbereich,
        layer: VectorLayer) {

        super();

        const olFeature = this.createFeature(interbereich);
        olFeature.setStyle(this.createHstPolygonStyle(interbereich));
        this.setMultiPolygonGeometry(olFeature, interbereich.hstPolygon);
        layer.getSource().addFeature(olFeature);


        const olFeatureBorder = this.createFeature(interbereich);
        olFeatureBorder.setStyle(this.createOuterPolygonStyle(interbereich));
        this.setMultiPolygonGeometry(olFeatureBorder, interbereich.polygon);
        layer.getSource().addFeature(olFeatureBorder);

        interbereich.ankerpunkte.forEach(ankerpunkt => {
            const olAnkerpunkt = new OlAnkerpunkt(ankerpunkt, layer);
        });
    }


    private createHstPolygonStyle(interbereich: Interbereich): Style {
        const colorHex = '#FF6666';
        const colorHexBg = '#FFFFFF';
        return new Style({
            fill: new Fill({
                color: OlHelper.getRgbaFromHex(colorHex, 0.5)
            }),
            stroke: new Stroke({
                color: OlHelper.getRgbaFromHex(colorHexBg, 0.2),
                width: 1,
            }),
        });
    }


    private createOuterPolygonStyle(interbereich: Interbereich): Style {
        const colorHex = '#FF6666';
        const colorHexBg = '#FFFFFF';
        return new Style({
            stroke: new Stroke({
                color: OlHelper.getRgbaFromHex(colorHex, 0.8),
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
