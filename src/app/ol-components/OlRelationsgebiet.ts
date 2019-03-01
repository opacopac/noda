import Vector from 'ol/source';
import Feature from 'ol/Feature';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Position2d} from '../geo/position-2d';
import {Relationsgebiet} from '../model/relationsgebiet';


export class OlRelationsgebiet extends OlComponentBase {
    // private readonly olFeature: Feature;


    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        relationsgebiet: Relationsgebiet,
        private readonly source: Vector) {

        super();

        const style = this.createStyle();
        relationsgebiet.atomicKantenLut.forEach(atomicKante => {
            const olFeature = this.createFeature(relationsgebiet);
            olFeature.setStyle(style);
            this.setLineGeometry(olFeature, [atomicKante[0].position, atomicKante[1].position]);
            this.source.addFeature(olFeature);
        });

        /*this.olFeature = this.createFeature(relationsgebiet);
        this.olFeature.setStyle(this.createStyle());
        const hstList = this.getHstList(relationsgebiet);
        this.setLineGeometry(this.olFeature, hstList);
        this.source.addFeature(this.olFeature);*/
    }


    private createStyle(): Style {
        return new Style({
            stroke: new Stroke({
                color: 'rgba(63, 63, 255, 0.7)',
                width: 5,
            })
        });
    }


    private getHstList(relationsgebiet: Relationsgebiet): Position2d[] {
        return relationsgebiet.haltestellenLut.map(hst => hst.position);
    }
}
