import {Injectable} from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import {DrData} from '../model/dr-data';
import {OlKante} from '../ol-components/OlKante';
import {OlHaltestelle} from '../ol-components/OlHaltestelle';
import {OlMapCoords, OlMapService} from './ol-map.service';
import {Extent2d} from '../geo/extent-2d';
import {Haltestelle} from '../model/haltestelle';
import {Kante} from '../model/kante';
import {QuadTree} from '../quadtree/quad-tree';
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


@Injectable({
    providedIn: 'root'
})
export class MapStateService {
    public drData: DrData;
    private currentMouseOverDataItem: DataItem;
    private _showKanten = true;
    private _showZonen = true;
    private _showHst = true;
    private _showHstLabels = false;
    private _selectedZonenplan: Zonenplan;
    private _selectedInterbereich: Interbereich;
    private _selectedRelationsgebiet: Relationsgebiet;
    private hstQuadTree: QuadTree<Haltestelle>;
    private mapCoords: OlMapCoords;
    private kantenLayer: VectorLayer;
    private hstLayer: VectorLayer;
    private hstLabelLayer: VectorLayer;
    private zonenfillerLayer: VectorLayer;
    private zonenOuterLayer: VectorLayer;
    private interbereichLayer: VectorLayer;
    private relationsgebietLayer: VectorLayer;
    private selectedDataItemLayer: VectorLayer;


    public get showZonen(): boolean {
        return this._showZonen;
    }


    public set showZonen(value: boolean) {
        this._showZonen = value;
        this.updateMap();
    }


    public get showKanten(): boolean {
        return this._showKanten;
    }


    public set showKanten(value: boolean) {
        this._showKanten = value;
        this.updateMap();
    }


    public get showHst(): boolean {
        return this._showHst;
    }


    public set showHst(value: boolean) {
        this._showHst = value;
        this.updateMap();
    }


    public get showHstLabels(): boolean {
        return this._showHstLabels;
    }


    public set showHstLabels(value: boolean) {
        this._showHstLabels = value;
        this.updateMap();
    }


    constructor(private mapService: OlMapService) {
        this.mapService.onDataItemMouseOver.subscribe(this.onMouseOverDataItem.bind(this));
    }


    public updateMapCoords(mapCoords: OlMapCoords) {
        this.mapCoords = mapCoords;
        this.updateMap();
    }


    public selectZonenplan(zonenplan: Zonenplan) {
        this._selectedZonenplan = zonenplan;
        this.mapService.setExtent(zonenplan.getExtent());
        this.drawZonenplan(zonenplan, !this._showZonen);
        this.updateMap();
    }


    public selectInterbereich(interbereich: Interbereich) {
        this._selectedInterbereich = interbereich;
        this.mapService.setExtent(interbereich.getExtent());
        this.drawInterbereich(interbereich);
        this.updateMap();
    }


    public selectRelationsgebiet(relationsgebiet: Relationsgebiet) {
        this._selectedRelationsgebiet = relationsgebiet;
        this.mapService.setExtent(relationsgebiet.getExtent());
        this.drawRelationsgebiet(relationsgebiet);
        this.updateMap();
    }


    public updateDrData(drData: DrData) {
        this.drData = drData;
        this.hstQuadTree = PrecalcHelper.precalc(drData);
        this.updateMap();
    }


    private updateMap() {
        if (!this.drData || !this.mapCoords) {
            return;
        }

        if (!this.hstLayer || !this.kantenLayer || !this.zonenfillerLayer || !this.relationsgebietLayer) {
            this.initLayers();
        }

        const maxResults = 500; // this._showHstLabels ? 100 : 500;
        const hstList = this.searchHaltestellen(this.mapCoords.extent, maxResults);
        if (this._showHst)  {
            this.drawHaltestellen(hstList, this._showHstLabels);
        } else {
            this.drawHaltestellen([], false);
        }

        const kantenList = this._showKanten ? this.searchKanten(hstList) : [];
        this.drawKanten(kantenList);

        this.drawZonenplan(this._selectedZonenplan, !this._showZonen);
    }


    private initLayers() {
        this.zonenfillerLayer = this.mapService.addVectorLayer(true);
        this.zonenOuterLayer = this.mapService.addVectorLayer(true);
        this.interbereichLayer = this.mapService.addVectorLayer(true);
        this.relationsgebietLayer = this.mapService.addVectorLayer(true);
        this.kantenLayer = this.mapService.addVectorLayer(true);
        this.hstLayer = this.mapService.addVectorLayer(true);
        this.hstLabelLayer = this.mapService.addVectorLayer(true, true);

        this.selectedDataItemLayer = this.mapService.addVectorLayer(true);
    }


    public onMouseOverDataItem(dataItem: DataItem) {
        if (dataItem === this.currentMouseOverDataItem) {
            return;
        } else {
            this.currentMouseOverDataItem = dataItem;
        }

        this.drawSelectedItem(dataItem);
    }


    // region draw

    private drawKanten(kantenList: Kante[]) {
        this.kantenLayer.getSource().clear(true);

        kantenList.forEach(kante => {
            const olKante = new OlKante(kante, this.kantenLayer);
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
        return this.hstQuadTree.searchItems(extent, maxResults);
    }


    private searchKanten(hstResult: Haltestelle[]): Kante[] {
        const kantenResult: Kante[] = [];

        hstResult.forEach(hst => {
            hst.kantenLut.forEach(kante => kantenResult.push(kante));
        });

        return kantenResult;
    }
}
