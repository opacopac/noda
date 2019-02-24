import {Injectable} from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import {DrData} from '../model/dr-data';
import {OlKante} from '../ol-components/OlKante';
import {OlHaltestelle} from '../ol-components/OlHaltestelle';
import {OlMapCoords, OlMapService} from './ol-map.service';
import {OlZone} from '../ol-components/OlZone';


@Injectable({
    providedIn: 'root'
})
export class MapFeaturesService {
    private drData: DrData;
    private mapCoords: OlMapCoords;
    private kantenLayer: VectorLayer;
    private hstLayer: VectorLayer;
    private zonenLayer: VectorLayer;


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

        if (!this.hstLayer || !this.kantenLayer || !this.zonenLayer) {
            this.initLayers();
        }

        this.drawKanten();
        this.drawHaltestellen();
        this.drawZonen();
    }


    private initLayers() {
        this.zonenLayer = this.mapService.addVectorLayer(true);
        this.kantenLayer = this.mapService.addVectorLayer(true);
        this.hstLayer = this.mapService.addVectorLayer(true);
    }


    private drawKanten() {
        this.kantenLayer.getSource().clear(true);

        this.drData.kanten.forEach(kante => {
            const olKante = new OlKante(kante, this.kantenLayer.getSource());
        });
    }


    private drawHaltestellen() {
        this.hstLayer.getSource().clear(true);

        this.drData.haltestellen.forEach(hst => {
            const olHst = new OlHaltestelle(hst, this.hstLayer.getSource());
        });
    }


    private drawZonen() {
        this.zonenLayer.getSource().clear(true);

        this.drData.zonen.forEach(zone => {
            const olHst = new OlZone(zone, this.hstLayer.getSource());
        });
    }
}
