import VectorLayer from 'ol/layer';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlFeatureHelper} from './OlFeatureHelper';
import {Kante, VerkehrsmittelTyp} from '../model/kante';
import {Position2d} from '../geo/position-2d';


export class OlKante {
    private static readonly DASH_LENGTH_PIXEL = 20;


    public static drawKante(kante: Kante, layer: VectorLayer) {
        const olFeature = OlFeatureHelper.createFeature(kante);
        olFeature.setStyle(this.createStyle(kante));
        OlFeatureHelper.setLineGeometry(olFeature, [kante.haltestelle1.position, kante.haltestelle2.position]);
        layer.getSource().addFeature(olFeature);
    }


    public static drawLabel(kante: Kante, layer: VectorLayer) {
        const olLabelFeature = OlFeatureHelper.createFeature(kante);
        olLabelFeature.setStyle(this.createLabelStyle(kante));
        OlFeatureHelper.setPointGeometry(olLabelFeature, Position2d.calcMidPoint(kante.haltestelle1.position, kante.haltestelle2.position));
        layer.getSource().addFeature(olLabelFeature);
    }



    private static createStyle(kante: Kante): Style {
        let dash, dashOffset;
        const tot = kante.parallelKanteLut.length;
        if (tot > 1) {
            dash = [OlKante.DASH_LENGTH_PIXEL, (tot - 1) * OlKante.DASH_LENGTH_PIXEL];
            dashOffset = OlKante.DASH_LENGTH_PIXEL * kante.parallelKanteLut.indexOf(kante);
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


    private static createLabelStyle(kante: Kante): Style {
        let betreiber: string;
        if (kante.parallelKanteLut.length > 1 && kante.parallelKanteLut.indexOf(kante) === 0) {
            betreiber = kante.parallelKanteLut.reduce((totVal, kte) => totVal + '\n' + kte.betreiber, '');
        } else {
            betreiber = kante.betreiber;
        }

        return new Style({
            text: new Text({
                font: 'bold 10px Calibri,sans-serif',
                text: betreiber,
                fill: new Fill({ color: '#000000' }),
                stroke: new Stroke({ color: '#FFFFFF', width: 2 }),
            })
        });
    }


    private static getKanteColor(kante: Kante): string {
        switch (kante.verkehrsmittelTyp) {
            case VerkehrsmittelTyp.BUS: return '#FFCC00';
            case VerkehrsmittelTyp.SCHIFF: return '#6666FF';
            case VerkehrsmittelTyp.BAHN: return '#111111';
            case VerkehrsmittelTyp.FUSSWEG:
            default: return '#000099';
        }
    }
}
