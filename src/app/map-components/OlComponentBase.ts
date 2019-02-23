import Vector from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import MultiPolygon from 'ol/geom/MultiPolygon';
import {Position2d} from '../geo/position-2d';
import {DataItem} from '../model/data-item';


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
            const newPos = position.getMercator();
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
        const newPosList = positionList ? positionList.map((pos) => pos.getMercator()) : undefined;
        const olLine = (feature.getGeometry() as LineString);
        if (!olLine) {
            feature.setGeometry(new LineString(newPosList));
        } else {
            olLine.setCoordinates(newPosList);
        }
    }


    protected setPolygonGeometry(feature: Feature, polygon: Polygon) {
        if (!polygon) {
            this.hideFeature(feature);
        }
        const newPolygon = polygon ? polygon.getMercatorList() : undefined;
        const olPolygon = (feature.getGeometry() as Polygon);
        if (!olPolygon) {
            feature.setGeometry(new Polygon([newPolygon]));
        } else {
            olPolygon.setCoordinates([newPolygon]);
        }
    }


    protected setMultiPolygonGeometry(feature: Feature, multiPolygon: MultiPolygon) {
        if (!multiPolygon) {
            this.hideFeature(feature);
        }
        const newPolygon = multiPolygon ? multiPolygon.getMercatorList() : undefined;
        const olPolygon = (feature.getGeometry() as Polygon);
        if (!olPolygon) {
            feature.setGeometry(new Polygon(newPolygon));
        } else {
            olPolygon.setCoordinates(newPolygon);
        }
    }
}
