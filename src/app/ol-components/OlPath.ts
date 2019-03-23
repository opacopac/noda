import VectorLayer from 'ol/layer';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlFeatureHelper} from './OlFeatureHelper';
import {Path} from '../model/path';
import {OlHaltestelle} from './OlHaltestelle';


export class OlPath {
    public static draw(path: Path, layer: VectorLayer, labelLayer: VectorLayer) {
        const hstSeq = path.getHstSequence();
        const olFeature = OlFeatureHelper.createFeature(path);
        OlFeatureHelper.setLineGeometry(olFeature, hstSeq.map(hst => hst.position));
        olFeature.setStyle(this.createLineStyle());
        layer.getSource().addFeature(olFeature);

        OlHaltestelle.drawHst(path.origin, layer);
        OlHaltestelle.drawHst(path.destination, layer);
        OlHaltestelle.drawLabel(path.origin, labelLayer);
        OlHaltestelle.drawLabel(path.destination, labelLayer);

        hstSeq.forEach(hst => {
            if (hst !== path.origin && hst !== path.destination) {
                OlHaltestelle.drawHst(hst, layer);
                OlHaltestelle.drawLabel(hst, labelLayer);
            }
        });

    }


    private static createLineStyle(): Style {
        return new Style({
            stroke: new Stroke({
                color: '#00CCFF',
                // color: 'rgba(63, 63, 255, 0.7)',
                width: 6,
            })
        });
    }
}
