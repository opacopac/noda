import VectorLayer from 'ol/layer';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlFeatureHelper} from './OlFeatureHelper';
import {Kante, VerkehrsmittelTyp} from '../model/kante';
import {Position2d} from '../geo/position-2d';
import {OlColorHelper} from './OlColorHelper';


export class OlVerkehrsKante {
    public static draw(kante: Kante, layer: VectorLayer) {
        const olFeature = OlFeatureHelper.createFeature(kante, true);
        olFeature.setStyle(this.createStyle(kante));
        OlFeatureHelper.setLineGeometry(olFeature, [kante.haltestelle1.position, kante.haltestelle2.position]);
        layer.getSource().addFeature(olFeature);
    }


    public static drawLabel(kante: Kante, layer: VectorLayer) {
        const olLabelFeature = OlFeatureHelper.createFeature(kante, true);
        olLabelFeature.setStyle(this.createLabelStyle(kante));
        OlFeatureHelper.setPointGeometry(olLabelFeature, Position2d.calcMidPoint(kante.haltestelle1.position, kante.haltestelle2.position));
        layer.getSource().addFeature(olLabelFeature);
    }


    private static createStyle(kante: Kante): Style {
        if (kante.verkehrsmittelTyp === VerkehrsmittelTyp.FUSSWEG) {
            return this.createFusswegStyle(kante);
        } else {
            return OlColorHelper.createMultiColorStyle(
                kante.parallelKanteLut.indexOf(kante),
                kante.parallelKanteLut.length,
                this.getKanteColor(kante),
                2
            );
        }
    }


    public static createFusswegStyle(kante: Kante): Style {
        return new Style({
            stroke: new Stroke({
                color: this.getKanteColor(kante),
                width: 2,
                lineDash: [10, 7],
                lineDashOffset: 0
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
