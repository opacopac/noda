import Vector from 'ol/source';
import Feature from 'ol/Feature';
import {Style, Icon, Fill, Circle, Text, Stroke} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Zone} from '../model/zone';
import {Position2d} from '../geo/position-2d';
import {Haltestelle} from '../model/haltestelle';


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
        const hstPolyList = this.getHstPolygonList(zone);
        this.setMultiPolygonGeometry(this.olFeature, hstPolyList);
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


    private getHstPolygonList(zone: Zone): Position2d[][] {
        const hstList: Haltestelle[] = [];
        zone.kanten.forEach(kante => {
            if (hstList.indexOf(kante.haltestelle1) === -1) {
                hstList.push(kante.haltestelle1);
            }

            if (hstList.indexOf(kante.haltestelle2) === -1) {
                hstList.push(kante.haltestelle2);
            }
        });

        return hstList.map(hst => hst.polygon);
    }
}
