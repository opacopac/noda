import Vector from 'ol/source';
import Feature from 'ol/Feature';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Kante, VerkehrsmittelTyp} from '../model/kante';


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
                width: 3,
                lineDash: kante.verkehrsmittelTyp === VerkehrsmittelTyp.FUSSWEG ? [10, 7] : undefined
            })
        });
    }


    private getKanteColor(kante: Kante): string {
        switch (kante.verkehrsmittelTyp) {
            case VerkehrsmittelTyp.BUS: return '#FFFF00';
            case VerkehrsmittelTyp.SCHIFF: return '#6666FF';
            case VerkehrsmittelTyp.BAHN: return '#111111';
            case VerkehrsmittelTyp.FUSSWEG:
            default: return '#000099';
        }
    }
}
