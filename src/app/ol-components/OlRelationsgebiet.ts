import VectorLayer from 'ol/layer';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {Relationsgebiet} from '../model/relationsgebiet';
import {OlFeatureHelper} from './OlFeatureHelper';


export class OlRelationsgebiet {
    public static draw(relationsgebiet: Relationsgebiet, layer: VectorLayer) {
        const style = this.createStyle();
        relationsgebiet.atomicKantenLut.forEach(atomicKante => {
            const olFeature = OlFeatureHelper.createFeature(relationsgebiet);
            olFeature.setStyle(style);
            OlFeatureHelper.setLineGeometry(olFeature, [atomicKante[0].position, atomicKante[1].position]);
            layer.getSource().addFeature(olFeature);
        });
    }


    private static createStyle(): Style {
        return new Style({
            stroke: new Stroke({
                color: 'rgba(63, 63, 255, 0.7)',
                width: 6,
            })
        });
    }
}
