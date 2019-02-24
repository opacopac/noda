import Vector from 'ol/source';
import Feature from 'ol/Feature';
import {Style, Icon, Fill, Circle, Text, Stroke} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Kante} from '../model/kante';


export class OlKante extends OlComponentBase {
    private readonly olFeature: Feature;


    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        kante: Kante,
        private readonly source: Vector) {

        super();

        this.olFeature = this.createFeature(kante);
        this.olFeature.setStyle(this.createStyle());
        this.setLineGeometry(this.olFeature, [kante.haltestelle1.position, kante.haltestelle2.position]);
        this.source.addFeature(this.olFeature);
    }


    private createStyle(): Style {
        return new Style({
            stroke: new Stroke({
                color: '#FF00FF',
                width: 5
            })
        });
    }
}
