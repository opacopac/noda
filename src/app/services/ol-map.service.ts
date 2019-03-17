import {EventEmitter, Injectable} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import Tile from 'ol/layer/Tile';
import Layer from 'ol/layer/Layer';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import {MapEvent, ObjectEvent} from 'ol/events';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import {fromLonLat} from 'ol/proj';
import {Extent2d} from '../geo/extent-2d';
import {Position2d} from '../geo/position-2d';
import {OlPos} from '../geo/ol-pos';
import {DataItem} from '../model/data-item';
import {OlComponentBase} from '../ol-components/OlComponentBase';
import Pixel from 'ol/pixel';
import Feature from 'ol/Feature';


export class OlMapCoords {
    constructor(
        public position: Position2d,
        public zoom: number,
        public extent: Extent2d
    ) {
    }
}


@Injectable({
    providedIn: 'root'
})
export class OlMapService {
    public onMapCoordsChanged = new EventEmitter<OlMapCoords>();
    public onMapClicked = new EventEmitter<{ clickPos: Position2d, dataItem: DataItem }>();
    public onDataItemMouseOver = new EventEmitter<DataItem>();
    private map: Map;
    private mapLayer: Tile;
    private customLayers: VectorLayer[] = [];
    private readonly CLICK_TOLERANCE_PIXELS = 10;
    private readonly MOUSOVER_TOLERANCE_PIXELS = 0;


    constructor() {
    }


    public initMap(targetElement: string) {
        this.mapLayer = new Tile({
            source: new XYZ({
                url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }),
            opacity: 0.4
        });

        this.map = new Map({
            target: targetElement,
            layers: [ this.mapLayer ],
            view: new View({
                center: fromLonLat([8.226667, 46.80111]), // center of CH
                zoom: 9
            })
        });


        // map events
        this.map.on('moveend', this.onMoveEnd.bind(this));
        this.map.on('singleclick', this.onSingleClick.bind(this));
        this.map.on('pointermove', this.onPointerMove.bind(this));
    }


    // region layers

    public addVectorLayer(imageRenderMode: boolean, declutter: boolean = false): VectorLayer {
        const layer = this.createEmptyVectorLayer(imageRenderMode, declutter);
        this.customLayers.push(layer);

        this.map.addLayer(layer);

        return layer;
    }


    private createEmptyVectorLayer(imageRenderMode: boolean = false, declutter: boolean = false): Vector {
        return new VectorLayer({
            source: new Vector({}),
            renderMode: imageRenderMode ? 'image' : undefined,
            declutter: declutter
        });
    }

    // endregion


    // region map position / zoom / extent

    public getZoom(): number {
        return this.map.getView().getZoom();
    }


    public getMapPosition(): Position2d {
        return OlPos.getLonLat(this.map.getView().getCenter());
    }


    public getExtent(): Extent2d {
        const merExt = this.map.getView().calculateExtent(this.map.getSize());
        const minPos = OlPos.getLonLat([merExt[0], merExt[1]]);
        const maxPos = OlPos.getLonLat([merExt[2], merExt[3]]);
        return new Extent2d(
            minPos.longitude,
            minPos.latitude,
            maxPos.longitude,
            maxPos.latitude
        );
    }


    public setExtent(extent: Extent2d): void {
        if (!extent) {
            return;
        }

        const minPos = OlPos.getMercator(extent.minPos);
        const maxPos = OlPos.getMercator(extent.maxPos);
        const merExt = [minPos[0], minPos[1], maxPos[0], maxPos[1]];
        this.map.getView().fit(merExt);
    }


    // endregion


    // region map events

    private onMoveEnd(event: MapEvent) {
        this.emitPosZoomEvent();
    }


    private emitPosZoomEvent() {
        const mapCoords = new OlMapCoords(
            this.getMapPosition(),
            this.getZoom(),
            this.getExtent());

        this.onMapCoordsChanged.emit(mapCoords);
    }


    private onSingleClick(event: MapBrowserEvent) {
        const olFeatureList = this.getFeaturesAtPixel(event.pixel, this.CLICK_TOLERANCE_PIXELS);
        const dataItemList = this.getDataItemsFromFeatures(olFeatureList, true);

        if (dataItemList.length > 0) {
            const clickPos = OlPos.getLonLat(event.coordinate);
            this.onMapClicked.emit({clickPos: clickPos, dataItem: dataItemList[0]});
        }
    }


    private onPointerMove(event: MapBrowserEvent) {
        if (event.dragging) {
            return;
        }

        const olFeatureList = this.getFeaturesAtPixel(event.pixel, this.MOUSOVER_TOLERANCE_PIXELS);
        this.setCursorStyle(olFeatureList);
        this.emitMouseOver(olFeatureList);
    }


    private getFeaturesAtPixel(pixel: Pixel, hitTolerance: number): Feature[] {
        const olFeatureList: Feature[] = this.map.getFeaturesAtPixel(
            pixel,
            { layerFilter: this.isClickableLayer.bind(this), hitTolerance: hitTolerance }
        );

        return olFeatureList ? olFeatureList : [];
    }


    private getDataItemsFromFeatures(olFeatureList: Feature[], onlySelectable: boolean): DataItem[] {
        // TODO: sort order
        return olFeatureList
            .filter(feature => !onlySelectable || OlComponentBase.isSelectable(feature))
            .map(feature => OlComponentBase.getDataItem(feature))
            .filter(dataItem => dataItem !== undefined);
    }


    private setCursorStyle(olFeatureList: Feature[]) {
        const selectableDataItemList = this.getDataItemsFromFeatures(olFeatureList, true);

        if (selectableDataItemList.length > 0) {
            const element = this.map.getTargetElement() as HTMLElement;
            element.style.cursor = 'pointer';
        } else {
            const element = this.map.getTargetElement() as HTMLElement;
            element.style.cursor = 'default';
        }
    }


    private emitMouseOver(olFeatureList: Feature[]) {
        const dataItemList = olFeatureList
            .map(feature => OlComponentBase.getDataItem(feature))
            .filter(dataItem => dataItem !== undefined);

        if (dataItemList && dataItemList.length > 0) {
            this.onDataItemMouseOver.emit(dataItemList[0]);
        } else {
            this.onDataItemMouseOver.emit(undefined);
        }
    }


    private isClickableLayer(layer: Layer): boolean {
        return layer !== this.mapLayer;
    }

    // endregion
}
