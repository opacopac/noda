import VectorLayer from 'ol/layer';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Relationsgebiet} from '../model/relationsgebiet';


export class OlRelationsgebiet extends OlComponentBase {
    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        relationsgebiet: Relationsgebiet,
        layer: VectorLayer) {

        super();

        const style = this.createStyle();
        relationsgebiet.atomicKantenLut.forEach(atomicKante => {
            const olFeature = this.createFeature(relationsgebiet);
            olFeature.setStyle(style);
            this.setLineGeometry(olFeature, [atomicKante[0].position, atomicKante[1].position]);
            layer.getSource().addFeature(olFeature);
        });
    }


    private createStyle(): Style {
        return new Style({
            stroke: new Stroke({
                color: 'rgba(63, 63, 255, 0.7)',
                width: 5,
            })
        });
    }
}
