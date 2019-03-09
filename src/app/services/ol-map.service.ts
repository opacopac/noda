import {EventEmitter, Injectable} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import Tile from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import {MapEvent, ObjectEvent} from 'ol/events';
import {fromLonLat} from 'ol/proj';
import {Extent2d} from '../geo/extent-2d';
import {Position2d} from '../geo/position-2d';
import {OlPos} from '../geo/ol-pos';


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
    private map: Map;
    private mapLayer: Tile;
    private customLayers: VectorLayer[] = [];
    public onMapCoordsChanged = new EventEmitter<OlMapCoords>();


    constructor() {
    }


    public initMap(targetElement: string) {
        this.mapLayer = new Tile({
            source: new XYZ({
                url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });

        this.map = new Map({
            target: targetElement,
            layers: [ this.mapLayer ],
            view: new View({
                center: fromLonLat([7.0, 47.0]),
                zoom: 7
            })
        });


        // map events
        this.map.on('moveend', this.onMoveEnd.bind(this));
    }


    // region layers

    public addVectorLayer(imageRenderMode: boolean): VectorLayer {
        const layer = this.createEmptyVectorLayer(imageRenderMode);
        this.customLayers.push(layer);

        this.map.addLayer(layer);

        return layer;
    }


    private createEmptyVectorLayer(imageRenderMode: boolean = false): Vector {
        return new VectorLayer({
            source: new Vector({}),
            renderMode: imageRenderMode ? 'image' : undefined,
            // declutter: true
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

    // endregion
}
