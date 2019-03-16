import VectorLayer from 'ol/layer';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Ankerpunkt} from '../model/ankerpunkt';
import {Haltestelle} from '../model/haltestelle';
import {Kante} from '../model/kante';


export class OlAnkerpunkt extends OlComponentBase {
    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        ankerpunkt: Ankerpunkt,
        layer: VectorLayer) {

        super();

        ankerpunkt.haltestellenList.forEach(hst => {
            const olFeature = this.createFeature(hst);
            olFeature.setStyle(this.createPointStyle(hst));
            this.setPointGeometry(olFeature, hst.position);
            layer.getSource().addFeature(olFeature);
        });

        ankerpunkt.zubringerList.forEach(zubr => {
            zubr.forEach(kante => {
                const olFeature = this.createFeature(kante);
                olFeature.setStyle(this.createZubringerStyle(kante));
                this.setLineGeometry(olFeature, [kante.haltestelle1.position, kante.haltestelle2.position]);
                layer.getSource().addFeature(olFeature);
            });
        });
    }


    private createPointStyle(haltestelle: Haltestelle): Style {
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


    private createZubringerStyle(kante: Kante): Style {
        return new Style({
            /*fill: new Fill({
                color: '#999999'
            }),*/
            stroke: new Stroke({
                color: '#FFFF00',
                width: 4
            })
        });
    }
}
