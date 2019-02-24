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
        this.olFeature.setStyle(this.createStyle(kante));
        this.setLineGeometry(this.olFeature, [kante.haltestelle1.position, kante.haltestelle2.position]);
        this.source.addFeature(this.olFeature);
    }


    private createStyle(kante: Kante): Style {
        return new Style({
            /*fill: new Fill({
                color: '#999999'
            }),*/
            stroke: new Stroke({
                color: this.getKanteColor(kante),
                width: 3
            })
        });
    }


    private getKanteColor(kante: Kante): string {
        switch (kante.verkehrsmittelTyp) {
            case 'BUS': return '#FFCC00';
            case 'SCHIFF': return '#6666FF';
            case 'BAHN': return '#111111';
            case 'FUSSWEG':
            default: return '#EE00EE';
        }
    }
}
