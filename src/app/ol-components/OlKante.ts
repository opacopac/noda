import VectorLayer from 'ol/layer';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Kante, VerkehrsmittelTyp} from '../model/kante';


export class OlKante extends OlComponentBase {
    private readonly DASH_LENGTH_PIXEL = 20;

    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        kante: Kante,
        layer: VectorLayer) {

        super();

        const olFeature = this.createFeature(kante);
        olFeature.setStyle(this.createStyle(kante));
        this.setLineGeometry(olFeature, [kante.haltestelle1.position, kante.haltestelle2.position]);
        layer.getSource().addFeature(olFeature);
    }


    private createStyle(kante: Kante): Style {
        let dash, dashOffset;
        const tot = kante.parallelKanteLut.length;
        if (tot > 1) {
            dash = [this.DASH_LENGTH_PIXEL, (tot - 1) * this.DASH_LENGTH_PIXEL];
            dashOffset = this.DASH_LENGTH_PIXEL * kante.parallelKanteLut.indexOf(kante);
        } else if (kante.verkehrsmittelTyp === VerkehrsmittelTyp.FUSSWEG) {
            dash = [10, 7];
            dashOffset = 0;
        } else {
            dash = [];
            dashOffset = 0;
        }

        return new Style({
            stroke: new Stroke({
                color: this.getKanteColor(kante),
                width: 2,
                lineDash: dash,
                lineDashOffset: dashOffset
            })
        });
    }


    private getKanteColor(kante: Kante): string {
        switch (kante.verkehrsmittelTyp) {
            case VerkehrsmittelTyp.BUS: return '#FFCC00';
            case VerkehrsmittelTyp.SCHIFF: return '#6666FF';
            case VerkehrsmittelTyp.BAHN: return '#111111';
            case VerkehrsmittelTyp.FUSSWEG:
            default: return '#000099';
        }
    }
}
