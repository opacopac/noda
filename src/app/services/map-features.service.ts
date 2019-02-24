import {Injectable} from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import {DrData} from '../model/dr-data';
import {OlKante} from '../ol-components/OlKante';
import {OlHaltestelle} from '../ol-components/OlHaltestelle';
import {OlMapCoords, OlMapService} from './ol-map.service';
import {OlZone} from '../ol-components/OlZone';
import {Extent2d} from '../geo/extent-2d';
import {Haltestelle} from '../model/haltestelle';
import {Kante} from '../model/kante';


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

        const hstList = this.searchHaltestellen(this.mapCoords.extent);
        this.drawHaltestellen(hstList);

        const kantenList = this.searchKanten(hstList);
        this.drawKanten(kantenList);

        // this.drawZonen();
    }


    private initLayers() {
        this.zonenLayer = this.mapService.addVectorLayer(true);
        this.kantenLayer = this.mapService.addVectorLayer(true);
        this.hstLayer = this.mapService.addVectorLayer(true);
    }


    private drawKanten(kantenList: Kante[]) {
        this.kantenLayer.getSource().clear(true);

        kantenList.forEach(kante => {
            const olKante = new OlKante(kante, this.kantenLayer.getSource());
        });
    }


    private drawHaltestellen(hstList: Haltestelle[]) {
        this.hstLayer.getSource().clear(true);

        hstList.forEach(hst => {
            const olHst = new OlHaltestelle(hst, this.hstLayer.getSource());
        });
    }


    private drawZonen() {
        this.zonenLayer.getSource().clear(true);

        this.drData.zonen.forEach(zone => {
            const olHst = new OlZone(zone, this.hstLayer.getSource());
        });
    }


    private searchHaltestellen(extent: Extent2d, maxResults = 100): Haltestelle[] {
        const hstResult: Haltestelle[] = [];

        for (const hst of this.drData.hstPrioList) {
            if (hstResult.length >= maxResults) {
                break;
            } else if (extent.containsPoint(hst.position)) {
                hstResult.push(hst);
            }
        }

        console.log(hstResult.length + ' haltestellen found');

        return hstResult;
    }


    private searchKanten(hstResult: Haltestelle[]): Kante[] {
        const kantenResult: Kante[] = [];

        hstResult.forEach(hst => {
            hst.kantenLut.forEach(kante => kantenResult.push(kante));
        });

        return kantenResult;
    }
}
