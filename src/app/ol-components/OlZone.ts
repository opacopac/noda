import Vector from 'ol/source';
import Feature from 'ol/Feature';
import {Style, Icon, Fill, Circle, Text, Stroke} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Zone} from '../model/zone';
import {Position2d} from '../geo/position-2d';


export class OlZone extends OlComponentBase {
    private readonly olFeature: Feature;


    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        zone: Zone,
        private readonly source: Vector) {

        super();

        this.olFeature = this.createFeature(zone);
        this.olFeature.setStyle(this.createStyle(zone));
        const posList = this.getPosList(zone);
        this.setPolygonGeometry(this.olFeature, posList);
        this.source.addFeature(this.olFeature);
    }


    private createStyle(zone: Zone): Style {
        return new Style({
            fill: new Fill({
                color: 'rgba(152, 206, 235, 0.3)'
            }),
            stroke: new Stroke({
                color: 'rgba(23, 128, 194, 0.8)',
                width: 3,
                lineDash: [10, 7]
            }),
            text: new Text({
                font: 'bold 14px Calibri,sans-serif',
                text: zone.code.toString(),
                fill: new Fill({color: 'rgba(255, 0, 0, 1.0)'}),
                stroke: new Stroke({color: '#FFFFFF', width: 2}),
            })
        });
    }


    private getPosList(zone: Zone): Position2d[] {
        const posList: Position2d[] = [];

        // TODO
        zone.kanten.forEach(kante => {
            posList.push(kante.haltestelle1.position);
            posList.push(kante.haltestelle2.position);
        });

        return posList;
    }
}
