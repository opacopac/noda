import {Injectable} from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import {DrData} from '../model/dr-data';
import {OlKante} from '../ol-components/OlKante';
import {OlHaltestelle} from '../ol-components/OlHaltestelle';
import {OlMapCoords, OlMapService} from './ol-map.service';
import {Extent2d} from '../geo/extent-2d';
import {Haltestelle} from '../model/haltestelle';
import {Kante} from '../model/kante';
import {Zonenplan} from '../model/zonenplan';
import {Relationsgebiet} from '../model/relationsgebiet';
import {OlRelationsgebiet} from '../ol-components/OlRelationsgebiet';
import {Interbereich} from '../model/interbereich';
import {OlInterbereich} from '../ol-components/OlInterbereich';
import {PrecalcHelper} from '../model/precalc-helper';
import {OlZonenplan} from '../ol-components/OlZonenplan';
import {DataItem} from '../model/data-item';
import {DataItemType} from '../model/data-item-type';
import {Zonelike} from '../model/zonelike';
import {OlZonelike} from '../ol-components/OlZonelike';
import {AppState} from './app-state';


@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    public appState: AppState;
    private kantenLayer: VectorLayer;
    private kantenLabelLayer: VectorLayer;
    private hstLayer: VectorLayer;
    private hstLabelLayer: VectorLayer;
    private zonenfillerLayer: VectorLayer;
    private zonenOuterLayer: VectorLayer;
    private interbereichLayer: VectorLayer;
    private relationsgebietLayer: VectorLayer;
    private selectedDataItemLayer: VectorLayer;
    private readonly MAX_HST_IN_VIEW = 500;


    public get showZonen(): boolean {
        return this.appState.showZonen;
    }


    public set showZonen(value: boolean) {
        this.appState.showZonen = value;
        this.updateMap();
    }


    public get showKanten(): boolean {
        return this.appState.showKanten;
    }


    public set showKanten(value: boolean) {
        this.appState.showKanten = value;
        this.updateMap();
    }


    public get showHst(): boolean {
        return this.appState.showHst;
    }


    public set showHst(value: boolean) {
        this.appState.showHst = value;
        this.updateMap();
    }


    public get showHstLabels(): boolean {
        return this.appState.showHstLabels;
    }


    public set showHstLabels(value: boolean) {
        this.appState.showHstLabels = value;
        this.updateMap();
    }


    public get showKantenLabels(): boolean {
        return this.appState.showKantenLabels;
    }


    public set showKantenLabels(value: boolean) {
        this.appState.showKantenLabels = value;
        this.updateMap();
    }


    constructor(private mapService: OlMapService) {
        this.appState = new AppState();
        this.mapService.onDataItemMouseOver.subscribe(this.onMouseOverDataItem.bind(this));
    }


    public updateMapCoords(mapCoords: OlMapCoords) {
        this.appState.mapCoords = mapCoords;
        this.updateMap();
    }


    public selectZonenplan(zonenplan: Zonenplan) {
        this.appState.selectedZonenplan = zonenplan;
        this.mapService.setExtent(zonenplan ? zonenplan.getExtent() : undefined);
        this.drawZonenplan(zonenplan, !this.appState.showZonen);
        this.updateMap();
    }


    public selectInterbereich(interbereich: Interbereich) {
        this.appState.selectedInterbereich = interbereich;
        this.mapService.setExtent(interbereich ? interbereich.getExtent() : undefined);
        this.drawInterbereich(interbereich);
        this.updateMap();
    }


    public selectRelationsgebiet(relationsgebiet: Relationsgebiet) {
        this.appState.selectedRelationsgebiet = relationsgebiet;
        this.mapService.setExtent(relationsgebiet ? relationsgebiet.getExtent() : undefined);
        this.drawRelationsgebiet(relationsgebiet);
        this.updateMap();
    }


    public updateDrData(drData: DrData) {
        this.appState.drData = drData;
        this.appState.hstQuadTree = PrecalcHelper.precalc(drData);
        this.updateMap();
    }


    private updateMap() {
        if (!this.appState.drData || !this.appState.mapCoords) {
            return;
        }

        if (!this.hstLayer) {
            this.initLayers();
        }

        const hstList = this.searchHaltestellen(this.appState.mapCoords.extent, this.MAX_HST_IN_VIEW);
        if (this.appState.showHst)  {
            this.drawHaltestellen(hstList, this.appState.showHstLabels);
        } else {
            this.drawHaltestellen([], false);
        }

        const kantenList = this.appState.showKanten ? this.searchKanten(hstList) : [];
        this.drawKanten(kantenList, this.appState.showKantenLabels);

        this.drawZonenplan(this.appState.selectedZonenplan, !this.appState.showZonen);
    }


    private initLayers() {
        this.zonenfillerLayer = this.mapService.addVectorLayer(true);
        this.zonenOuterLayer = this.mapService.addVectorLayer(true);
        this.interbereichLayer = this.mapService.addVectorLayer(true);
        this.relationsgebietLayer = this.mapService.addVectorLayer(true);
        this.kantenLayer = this.mapService.addVectorLayer(true);
        this.hstLayer = this.mapService.addVectorLayer(true);
        this.kantenLabelLayer = this.mapService.addVectorLayer(true, true);
        this.hstLabelLayer = this.mapService.addVectorLayer(true, true);

        this.selectedDataItemLayer = this.mapService.addVectorLayer(true);
    }


    public onMouseOverDataItem(dataItem: DataItem) {
        if (dataItem === this.appState.currentMouseOverDataItem) {
            return;
        } else {
            this.appState.currentMouseOverDataItem = dataItem;
        }

        this.drawSelectedItem(dataItem);
    }


    // region draw

    private drawKanten(kantenList: Kante[], showLabels: boolean) {
        this.kantenLayer.getSource().clear(true);
        this.kantenLabelLayer.getSource().clear(true);

        kantenList.forEach(kante => {
            const olKante = new OlKante(kante, this.kantenLayer, showLabels ? this.kantenLabelLayer : undefined);
        });
    }


    private drawHaltestellen(hstList: Haltestelle[], showLabels: boolean) {
        this.hstLayer.getSource().clear(true);
        this.hstLabelLayer.getSource().clear(true);

        hstList.forEach(hst => {
            const olHst = new OlHaltestelle(hst, this.hstLayer, showLabels ? this.hstLabelLayer : undefined);
        });
    }


    private drawZonenplan(zonenplan: Zonenplan, showLokalnetze: boolean) {
        this.zonenfillerLayer.getSource().clear(true);
        this.zonenOuterLayer.getSource().clear(true);

        if (!zonenplan) {
            return;
        }

        const olZonenplan = new OlZonenplan(zonenplan, showLokalnetze, this.zonenfillerLayer, this.zonenOuterLayer);
    }


    private drawInterbereich(interbereich: Interbereich) {
        this.interbereichLayer.getSource().clear(true);

        if (!interbereich) {
            return;
        }

        const olInterbereich = new OlInterbereich(interbereich, this.interbereichLayer);
    }


    private drawRelationsgebiet(relationsgebiet: Relationsgebiet) {
        this.relationsgebietLayer.getSource().clear(true);

        if (!relationsgebiet) {
            return;
        }

        const olRelationsgebiet = new OlRelationsgebiet(relationsgebiet, this.relationsgebietLayer);
    }


    private drawSelectedItem(dataItem: DataItem) {
        this.selectedDataItemLayer.getSource().clear(true);

        if (!dataItem) {
            return;
        }

        switch (dataItem.getType()) {
            case DataItemType.Zone:
            case DataItemType.Lokalnetz:
                OlZonelike.drawSelection(dataItem as Zonelike, this.selectedDataItemLayer);
                break;
        }
    }


    // endregion


    private searchHaltestellen(extent: Extent2d, maxResults: number): Haltestelle[] {
        return this.appState.hstQuadTree.searchItems(extent, maxResults);
    }


    private searchKanten(hstResult: Haltestelle[]): Kante[] {
        const kantenResult: Kante[] = [];

        hstResult.forEach(hst => {
            hst.kantenLut.forEach(kante => kantenResult.push(kante));
        });

        return kantenResult;
    }
}
