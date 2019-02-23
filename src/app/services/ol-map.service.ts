import {Injectable} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import {fromLonLat} from 'ol/proj';


@Injectable({
    providedIn: 'root'
})
export class OlMapService {
    private map: Map;
    private customLayers: VectorLayer[] = [];


    constructor() {
    }


    public initMap(targetElement: string) {
        this.map = new Map({
            target: targetElement,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    })
                })
            ],
            view: new View({
                center: fromLonLat([7.0, 47.0]),
                zoom: 7
            })
        });
    }


    public addVectorLayer(imageRenderMode: boolean): VectorLayer {
        const layer = this.createEmptyVectorLayer(imageRenderMode);
        this.customLayers.push(layer);

        this.map.addLayer(layer);

        return layer;
    }


    private createEmptyVectorLayer(imageRenderMode: boolean = false): Vector {
        return new VectorLayer({
            source: new Vector({}),
            renderMode: imageRenderMode ? 'image' : undefined
        });
    }
}
