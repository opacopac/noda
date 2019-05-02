import VectorLayer from 'ol/layer';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlFeatureHelper} from './OlFeatureHelper';
import {Linie} from '../model/linie';
import {Kante} from '../model/kante';
import {OlColorHelper} from './OlColorHelper';
import {Position2d} from '../geo/position-2d';


export class OlLinienKante {
    public static draw(kante: Kante, layer: VectorLayer) {
        const linie = kante.linieLut[0]; // TODO

        const olFeature = OlFeatureHelper.createFeature(kante);
        olFeature.setStyle(this.createStyle(linie));
        OlFeatureHelper.setLineGeometry(olFeature, [kante.haltestelle1.position, kante.haltestelle2.position]);
        layer.getSource().addFeature(olFeature);
    }


    public static drawLabel(kante: Kante, layer: VectorLayer) {
        const linie = kante.linieLut[0]; // TODO

        const olLabelFeature = OlFeatureHelper.createFeature(kante);
        olLabelFeature.setStyle(this.createLabelStyle(linie));
        OlFeatureHelper.setPointGeometry(olLabelFeature, Position2d.calcMidPoint(kante.haltestelle1.position, kante.haltestelle2.position));
        layer.getSource().addFeature(olLabelFeature);
    }


    private static createStyle(linie: Linie): Style {
        return new Style({
            stroke: new Stroke({
                color: this.getLinieColor(linie),
                width: 6,
                // lineDash: dash,
                // lineDashOffset: dashOffset
            })
        });
    }


    private static createLabelStyle(linie: Linie): Style {
        /*let betreiber: string;
        if (kante.parallelKanteLut.length > 1 && kante.parallelKanteLut.indexOf(kante) === 0) {
            betreiber = kante.parallelKanteLut.reduce((totVal, kte) => totVal + '\n' + kte.betreiber, '');
        } else {
            betreiber = kante.betreiber;
        }*/

        return new Style({
            text: new Text({
                font: 'bold 10px Calibri,sans-serif',
                text: linie.nr,
                fill: new Fill({ color: '#000000' }),
                stroke: new Stroke({ color: '#FFFFFF', width: 2 }),
            })
        });
    }


    private static getLinieColor(linie: Linie): string {
        return OlColorHelper.getRgbaFromLinie(linie, 1);
    }
}
