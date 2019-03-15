import VectorLayer from 'ol/layer';
import {Style, Icon, Fill, Circle, Text, Stroke} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Haltestelle} from '../model/haltestelle';


export class OlHaltestelle extends OlComponentBase {
    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        haltestelle: Haltestelle,
        layer: VectorLayer,
        labelLayer: VectorLayer) {

        super();

        const olFeature = this.createFeature(haltestelle);
        olFeature.setStyle(this.createPointStyle(haltestelle));
        this.setPointGeometry(olFeature, haltestelle.position);
        layer.getSource().addFeature(olFeature);

        if (labelLayer !== undefined) {
            const olLabelFeature = this.createFeature(haltestelle);
            olLabelFeature.setStyle(this.createLabelStyle(haltestelle));
            this.setPointGeometry(olLabelFeature, haltestelle.position);
            labelLayer.getSource().addFeature(olLabelFeature);
        }
    }


    private createPointStyle(haltestelle: Haltestelle): Style {
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


    private createLabelStyle(haltestelle: Haltestelle): Style {
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
