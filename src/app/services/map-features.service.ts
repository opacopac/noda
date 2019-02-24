import {Injectable} from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import {DrData} from '../model/dr-data';
import {OlKante} from '../ol-components/OlKante';
import {OlHaltestelle} from '../ol-components/OlHaltestelle';
import {OlMapCoords, OlMapService} from './ol-map.service';


@Injectable({
    providedIn: 'root'
})
export class MapFeaturesService {
    private drData: DrData;
    private mapCoords: OlMapCoords;
    private kantenLayer: VectorLayer;
    private hstLayer: VectorLayer;


    constructor(private mapService: OlMapService) {
    }


    public updateDrData(drData: DrData) {
        this.drData = drData;
        this.updateMap();
    }


    public updateMapCoords(mapCoords: OlMapCoords) {
        this.mapCoords = mapCoords;
        this.updateMap();
    }


    private updateMap() {
        if (!this.drData || !this.mapCoords) {
            return;
        }

        this.clearLayers();
        this.drawKanten();
        this.drawHaltestellen();
    }


    private clearLayers() {
        if (this.kantenLayer) {
            this.kantenLayer.getSource().clear(true);
        } else {
            this.kantenLayer = this.mapService.addVectorLayer(true);
        }

        if (this.hstLayer) {
            this.hstLayer.getSource().clear(true);
        } else {
            this.hstLayer = this.mapService.addVectorLayer(true);
        }
    }


    private drawKanten() {
        this.drData.kanten.forEach(kante => {
            const olKante = new OlKante(kante, this.kantenLayer.getSource());
        });
    }


    private drawHaltestellen() {
        this.drData.haltestellen.forEach(hst => {
            const olHst = new OlHaltestelle(hst, this.hstLayer.getSource());
        });
    }
}
