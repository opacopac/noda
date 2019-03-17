import VectorLayer from 'ol/layer';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {Ankerpunkt} from '../model/ankerpunkt';
import {Haltestelle} from '../model/haltestelle';
import {Kante} from '../model/kante';
import {OlFeatureHelper} from './OlFeatureHelper';


export class OlAnkerpunkt  {
    public static draw(ankerpunkt: Ankerpunkt, layer: VectorLayer) {
        ankerpunkt.haltestellenList.forEach(hst => {
            const olFeature = OlFeatureHelper.createFeature(hst);
            olFeature.setStyle(this.createPointStyle(hst));
            OlFeatureHelper.setPointGeometry(olFeature, hst.position);
            layer.getSource().addFeature(olFeature);
        });

        ankerpunkt.zubringerList.forEach(zubr => {
            zubr.forEach(kante => {
                const olFeature = OlFeatureHelper.createFeature(kante);
                olFeature.setStyle(this.createZubringerStyle(kante));
                OlFeatureHelper.setLineGeometry(olFeature, [kante.haltestelle1.position, kante.haltestelle2.position]);
                layer.getSource().addFeature(olFeature);
            });
        });
    }


    private static createPointStyle(haltestelle: Haltestelle): Style {
        return new Style({
            image: new Circle({
                radius: 10,
                fill: new Fill({
                    color: '#FFFF00'
                }),
                stroke: new Stroke({
                    color: '#000000',
                    width: 1
                }),
            }),
            text: new Text({
                font: 'bold 14px Calibri,sans-serif',
                text: haltestelle.bavName,
                fill: new Fill({color: '#000000'}),
                stroke: new Stroke({color: '#FFFF00', width: 2}),
                offsetX: 0,
                offsetY: 20,
            })
        });
    }


    private static createZubringerStyle(kante: Kante): Style {
        return new Style({
            /*fill: new Fill({
                color: '#999999'
            }),*/
            stroke: new Stroke({
                color: '#FFFF00',
                width: 6
            })
        });
    }
}
