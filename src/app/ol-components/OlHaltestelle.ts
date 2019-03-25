import VectorLayer from 'ol/layer';
import {Style, Icon, Fill, Circle, Text, Stroke} from 'ol/style';
import {Haltestelle} from '../model/haltestelle';
import {OlFeatureHelper} from './OlFeatureHelper';


export class OlHaltestelle {
    public static drawHst(haltestelle: Haltestelle, layer: VectorLayer) {
        const olFeature = OlFeatureHelper.createFeature(haltestelle, true);
        olFeature.setStyle(this.createPointStyle(haltestelle));
        OlFeatureHelper.setPointGeometry(olFeature, haltestelle.position);
        layer.getSource().addFeature(olFeature);
    }


    public static drawLabel(haltestelle: Haltestelle, layer: VectorLayer) {
        const olLabelFeature = OlFeatureHelper.createFeature(haltestelle, true);
        olLabelFeature.setStyle(this.createLabelStyle(haltestelle));
        OlFeatureHelper.setPointGeometry(olLabelFeature, haltestelle.position);
        layer.getSource().addFeature(olLabelFeature);
    }


    private static createPointStyle(haltestelle: Haltestelle): Style {
        const isActive = haltestelle.isActive();

        return new Style({
            image: new Circle({
                radius: 5,
                fill: new Fill({
                    color: isActive ? '#CCCCCC' : '#666666'
                }),
                stroke: new Stroke({
                    color: isActive ? '#000000' : '#000000',
                    width: 1
                }),
            })
        });
    }


    private static createLabelStyle(haltestelle: Haltestelle): Style {
        return new Style({
            text: new Text({
                font: 'bold 14px Calibri,sans-serif',
                text: haltestelle.bavName,
                fill: new Fill({color: '#333333'}),
                stroke: new Stroke({color: '#FFFFFF', width: 2}),
                offsetX: 0,
                offsetY: 20,
            })
        });
    }
}
