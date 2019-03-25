import Vector from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import MultiPolygon from 'ol/geom/MultiPolygon';
import {Position2d} from '../geo/position-2d';
import {DataItem} from '../model/data-item';
import {OlPos} from '../geo/ol-pos';
import {Polygon2d} from '../geo/polygon-2d';
import {MultiPolygon2d} from '../geo/multi-polygon-2d';


export class OlFeatureHelper {
    public static readonly PROPERTYNAME_DATAITEM = 'nodaDataItem';
    public static readonly PROPERTYNAME_ISSELECTABLE = 'nodaIsSelectable';


    private constructor() {}


    public static isSelectable(olFeature: Feature): boolean {
        if (!olFeature) {
            return false;
        } else {
            return (olFeature.get(this.PROPERTYNAME_ISSELECTABLE) === true);
        }
    }


    public static getDataItem(olFeature: Feature): DataItem {
        if (!olFeature) {
            return undefined;
        } else {
            return olFeature.get(this.PROPERTYNAME_DATAITEM) as DataItem;
        }
    }


    public static createFeature(dataItem: DataItem, isSelectable = false): Feature {
        const feature = new Feature();
        feature.set(OlFeatureHelper.PROPERTYNAME_DATAITEM, dataItem, true);
        feature.set(OlFeatureHelper.PROPERTYNAME_ISSELECTABLE, isSelectable, true);
        return feature;
    }


    public static removeFeature(feature: Feature, source: Vector) {
        this.removeFeaturesList([feature], source);
    }


    public static removeFeaturesList(featureList: Feature[], source: Vector) {
        for (const feature of featureList) {
            feature.unset(OlFeatureHelper.PROPERTYNAME_DATAITEM, true);
            source.removeFeature(feature);
        }
    }


    public static hideFeature(feature: Feature) {
        feature.setGeometry(undefined);
    }


    public static setPointGeometry(feature: Feature, position: Position2d) {
        if (!position) {
            this.hideFeature(feature);
            return;
        }

        const newPos = OlPos.getMercator(position);
        feature.setGeometry(new Point(newPos));
    }


    public static setLineGeometry(feature: Feature, positionList: Position2d[]) {
        if (!positionList) {
            this.hideFeature(feature);
            return;
        }

        const mercatorPosList = positionList ? positionList.map((pos) => OlPos.getMercator(pos)) : undefined;

        feature.setGeometry(new LineString(mercatorPosList));
    }


    public static setPolygonGeometry(feature: Feature, polygon: Polygon2d) {
        if (!polygon || !polygon.outerBoundary || polygon.outerBoundary.positionList.length === 0) {
            this.hideFeature(feature);
            return;
        }

        const mercatorBoundaryPosList = polygon.outerBoundary.positionList.map((pos) => OlPos.getMercator(pos));
        const mercatorHolePosLists = polygon.holes.map(hole => hole.positionList.map(pos => OlPos.getMercator(pos)));

        feature.setGeometry(new Polygon([mercatorBoundaryPosList, ...mercatorHolePosLists]));
    }


    public static setMultiPolygonGeometry(feature: Feature, multipolygon: MultiPolygon2d) {
        if (!multipolygon || !multipolygon.polygonList || multipolygon.polygonList.length === 0 ||
            !multipolygon.polygonList[0].outerBoundary || !multipolygon.polygonList[0].outerBoundary.positionList ||
            multipolygon.polygonList[0].outerBoundary.positionList.length === 0) {
            this.hideFeature(feature);
            return;
        }

        const olMultiPolygon = new MultiPolygon([]);
        multipolygon.polygonList.forEach(polygon => {
            if (polygon.outerBoundary && polygon.outerBoundary.positionList) {
                const mercatorBoundaryPosList = polygon.outerBoundary.positionList.map((pos) => OlPos.getMercator(pos));
                const mercatorHolePosLists = polygon.holes.map(hole => hole.positionList.map(pos => OlPos.getMercator(pos)));
                olMultiPolygon.appendPolygon(new Polygon([mercatorBoundaryPosList, ...mercatorHolePosLists]));
            }
        });

        feature.setGeometry(olMultiPolygon);
    }
}
