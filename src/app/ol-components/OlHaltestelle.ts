import Vector from 'ol/source';
import Feature from 'ol/Feature';
import {Style, Icon, Fill, Circle, Text, Stroke} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Haltestelle} from '../model/haltestelle';


export class OlHaltestelle extends OlComponentBase {
    private readonly olFeature: Feature;


    get isSelectable(): boolean {
        return true;
    }


    public constructor(
        haltestelle: Haltestelle,
        private readonly source: Vector,
        private readonly showLabels: boolean) {

        super();

        this.olFeature = this.createFeature(haltestelle);
        this.olFeature.setStyle(this.createPointStyle(haltestelle, this.showLabels));
        this.setPointGeometry(this.olFeature, haltestelle.position);
        this.source.addFeature(this.olFeature);
    }


    private createPointStyle(haltestelle: Haltestelle, showLabels: boolean): Style {
        return new Style({
            image: new Circle({
                radius: 5,
                fill: new Fill({
                    color: '#CCCCCC'
                }),
                stroke: new Stroke({color: '#000000', width: 1}),
            }),
            text: showLabels ? new Text({
                font: 'bold 14px Calibri,sans-serif',
                text: haltestelle.bavName,
                fill: new Fill({color: '#333333'}),
                stroke: new Stroke({color: '#FFFFFF', width: 2}),
                offsetX: 0,
                offsetY: 20
            }) : undefined
        });
    }
}
