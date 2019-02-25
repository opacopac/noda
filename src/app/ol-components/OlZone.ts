import Vector from 'ol/source';
import Feature from 'ol/Feature';
import {Style, Icon, Fill, Circle, Text, Stroke} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Zone} from '../model/zone';
import {Position2d} from '../geo/position-2d';
import {Haltestelle} from '../model/haltestelle';


export class OlZone extends OlComponentBase {
    private readonly olFeature: Feature;
    private readonly colorList = [
        '#e6194B',
        '#f58231',
        '#ffe119',
        '#bfef45',
        '#3cb44b',
        '#42d4f4',
        '#4363d8',
        '#911eb4',
        '#f032e6',
        '#800000',
        '#9A6324',
        '#808000',
        '#000075',
    ];

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
                color: this.getColorString(zone, 0.3)
            }),
            stroke: new Stroke({
                color: 'rgba(255, 255, 255, 0.2)', // this.getColorString(zone, 0.1),
                width: 1,
            }),
            text: new Text({
                font: 'bold 24px Calibri,sans-serif',
                text: zone.code.toString(),
                fill: new Fill({ color: this.getColorString(zone, 1.0) }),
                stroke: new Stroke({ color: '#FFFFFF', width: 3 }),
            })
        });
    }


    private getColorString(zone: Zone, opacity: number): string {
        const index = zone.code % 10; //  this.colorList.length;
        const colorHex = this.colorList[index];

        return 'rgba(' +
            this.getDecFromHex(colorHex.substr(1, 2)) + ',' +
            this.getDecFromHex(colorHex.substr(3, 2)) + ',' +
            this.getDecFromHex(colorHex.substr(5, 2)) + ',' +
            opacity + ')';
    }


    private getDecFromHex(colorHex: string): number {
        return parseInt(colorHex, 16);
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
