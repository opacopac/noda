import Vector from 'ol/source';
import Feature from 'ol/Feature';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Zonenplan} from '../model/zonenplan';
import {Zonelike} from '../model/zonelike';
import {OlHelper} from './OlHelper';
import {Position2d} from '../geo/position-2d';
import {Haltestelle} from '../model/haltestelle';
import {DataItemType} from '../model/data-item-type';
import {HstKanteZoneHelper} from '../model/hst-kante-zone-helper';
import {Interbereich} from '../model/interbereich';
import {Ring2d} from '../geo/ring-2d';
import {Polygon2d} from '../geo/polygon-2d';
import {MultiPolygon2d} from '../geo/multi-polygon-2d';


export class OlInterbereich extends OlComponentBase {
    private readonly olFeature: Feature;


    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        interbereich: Interbereich,
        private readonly source: Vector) {

        super();

        this.olFeature = this.createFeature(interbereich);
        this.olFeature.setStyle(this.createStyle(interbereich));
        const hstPolyList = this.getHstPolygonListFromKanten(interbereich);
        this.setMultiPolygonGeometry(this.olFeature, hstPolyList);
        this.source.addFeature(this.olFeature);
    }


    private createStyle(interbereich: Interbereich): Style {
        const colorHex = '#FF6666';
        const colorHexBg = '#FFFFFF';
        return new Style({
            fill: new Fill({
                color: OlHelper.getRgbaFromHex(colorHex, 0.5)
            }),
            stroke: new Stroke({
                color: OlHelper.getRgbaFromHex(colorHexBg, 0.2),
                width: 1,
            }),
            text: new Text({
                font: 'bold 18px Calibri,sans-serif',
                text: interbereich.name,
                fill: new Fill({ color: OlHelper.getRgbaFromHex(colorHex, 1.0), }),
                stroke: new Stroke({ color: OlHelper.getRgbaFromHex(colorHexBg, 1.0), width: 2 }),
            })
        });
    }


    private getHstPolygonListFromKanten(interbereich: Interbereich): MultiPolygon2d {
        const hstList: Haltestelle[] = [];

        interbereich.kanten.forEach(kante => HstKanteZoneHelper.addUniqueKantenHst(hstList, kante));

        return new MultiPolygon2d(hstList.map(hst => new Polygon2d(hst.ring)));
    }
}
