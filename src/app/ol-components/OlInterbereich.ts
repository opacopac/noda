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
    private readonly olFeatureBorder: Feature;


    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        interbereich: Interbereich,
        private readonly source: Vector) {

        super();

        this.olFeature = this.createFeature(interbereich);
        this.olFeature.setStyle(this.createHstPolygonStyle(interbereich));
        this.setMultiPolygonGeometry(this.olFeature, interbereich.hstPolygon);
        this.source.addFeature(this.olFeature);


        this.olFeatureBorder = this.createFeature(interbereich);
        this.olFeatureBorder.setStyle(this.createOuterPolygonStyle(interbereich));
        this.setMultiPolygonGeometry(this.olFeatureBorder, interbereich.polygon);
        this.source.addFeature(this.olFeatureBorder);
    }


    private createHstPolygonStyle(interbereich: Interbereich): Style {
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
        });
    }


    private createOuterPolygonStyle(interbereich: Interbereich): Style {
        const colorHex = '#FF6666';
        const colorHexBg = '#FFFFFF';
        return new Style({
            stroke: new Stroke({
                color: OlHelper.getRgbaFromHex(colorHex, 0.8),
                width: 3,
            }),
            text: new Text({
                font: 'bold 18px Calibri,sans-serif',
                text: interbereich.name,
                fill: new Fill({ color: colorHex, }),
                stroke: new Stroke({ color: colorHexBg, width: 2 }),
            })
        });
    }
}
