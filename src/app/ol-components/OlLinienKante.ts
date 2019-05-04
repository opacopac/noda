import VectorLayer from 'ol/layer';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlFeatureHelper} from './OlFeatureHelper';
import {Kante} from '../model/kante';
import {OlColorHelper} from './OlColorHelper';
import {Position2d} from '../geo/position-2d';
import {OlVerkehrsKante} from './OlVerkehrsKante';


export class OlLinienKante {
    public static draw(kante: Kante, layer: VectorLayer) {
        // draw everything already for the first parallel-kante
        if (kante.parallelKanteLut.indexOf(kante) > 0) {
            return;
        }

        const betreiberLinieList = kante.getDistinctAllBetreiberLinie();
        if (betreiberLinieList.length === 0) {
            OlVerkehrsKante.draw(kante, layer);
        } else {
            for (let i = 0; i < betreiberLinieList.length; i++) {
                const olFeature = OlFeatureHelper.createFeature(kante, true);
                olFeature.setStyle(this.createStyle(kante, betreiberLinieList, i));
                OlFeatureHelper.setLineGeometry(olFeature, [kante.haltestelle1.position, kante.haltestelle2.position]);
                layer.getSource().addFeature(olFeature);
            }
        }
    }


    public static drawLabel(kante: Kante, layer: VectorLayer) {
        // draw everything already for the first parallel-kante
        if (kante.parallelKanteLut.indexOf(kante) > 0) {
            return;
        }

        const betreiberList = kante.getDistinctBetreiber();
        const text = betreiberList.map(betreiber => {
            const linieText = kante.getDistinctLinienNrs(betreiber)
                .filter(linieNr => linieNr !== '-')
                .join(' ');

            return betreiber + (linieText.length > 0 ? ': ' + linieText : '');
        }).join('\n');
        const olLabelFeature = OlFeatureHelper.createFeature(kante, true);
        olLabelFeature.setStyle(this.createLabelStyle(text));
        OlFeatureHelper.setPointGeometry(olLabelFeature, Position2d.calcMidPoint(kante.haltestelle1.position, kante.haltestelle2.position));
        layer.getSource().addFeature(olLabelFeature);
    }


    private static createStyle(kante: Kante, betreiberLinieList: string[][], idx: number): Style {
        let color: string;
        if (kante.linieLut || kante.linieLut.length > 0) {
            color = OlColorHelper.getRgbaFromLinieNr(betreiberLinieList[idx][1], 1);
        } else {
            color = '#000000'; // no linie assigned
        }

        return OlColorHelper.createMultiColorStyle(
            idx,
            betreiberLinieList.length,
            color,
            2
        );
    }


    private static createLabelStyle(text: string): Style {
        return new Style({
            text: new Text({
                font: 'bold 10px Calibri,sans-serif',
                text: text,
                fill: new Fill({ color: '#000000' }),
                stroke: new Stroke({ color: '#FFFFFF', width: 2 }),
            })
        });
    }
}
