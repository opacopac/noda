import Vector from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import {Position2d} from '../geo/position-2d';
import {DataItem} from '../model/data-item';
import {OlPos} from '../geo/ol-pos';


export abstract class OlComponentBase {
    public static readonly PROPERTYNAME_DATAITEM = 'nodaDataItem';
    public static readonly PROPERTYNAME_ISSELECTABLE = 'nodaIsSelectable';


    protected constructor() {
    }


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


    public abstract get isSelectable(): boolean;


    protected createFeature(dataItem: DataItem): Feature {
        const feature = new Feature();
        feature.set(OlComponentBase.PROPERTYNAME_DATAITEM, dataItem, true);
        feature.set(OlComponentBase.PROPERTYNAME_ISSELECTABLE, this.isSelectable, true);
        return feature;
    }


    protected removeFeature(feature: Feature, source: Vector) {
        this.removeFeatures([feature], source);
    }


    protected removeFeatures(featureList: Feature[], source: Vector) {
        for (const feature of featureList) {
            feature.unset(OlComponentBase.PROPERTYNAME_DATAITEM, true);
            source.removeFeature(feature);
        }
    }


    protected hideFeature(feature: Feature) {
        feature.setGeometry(undefined);
    }


    protected setPointGeometry(feature: Feature, position: Position2d) {
        if (!position) {
            this.hideFeature(feature);
        } else {
            const newPos = OlPos.getMercator(position);
            const olPoint = (feature.getGeometry() as Point);
            if (!olPoint) {
                feature.setGeometry(new Point(newPos));
            } else {
                olPoint.setCoordinates(newPos);
            }
        }
    }


    protected setLineGeometry(feature: Feature, positionList: Position2d[]) {
        if (!positionList) {
            this.hideFeature(feature);
        }
        const mercatorPosList = positionList ? positionList.map((pos) => OlPos.getMercator(pos)) : undefined;
        const olLine = (feature.getGeometry() as LineString);
        if (!olLine) {
            feature.setGeometry(new LineString(mercatorPosList));
        } else {
            olLine.setCoordinates(mercatorPosList);
        }
    }


    protected setPolygonGeometry(feature: Feature, positionList: Position2d[]) {
        if (!positionList) {
            this.hideFeature(feature);
        }
        const mercatorPosList = positionList ? positionList.map((pos) => OlPos.getMercator(pos)) : undefined;
        const olPolygon = (feature.getGeometry() as Polygon);
        if (!olPolygon) {
            feature.setGeometry(new Polygon([mercatorPosList]));
        } else {
            olPolygon.setCoordinates([mercatorPosList]);
        }
    }
}