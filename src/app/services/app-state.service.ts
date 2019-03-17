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
import {BehaviorSubject, Observable} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    private readonly MAX_HST_IN_VIEW = 500;

    public readonly appState$: Observable<AppState>;
    private readonly appStateSubject: BehaviorSubject<AppState>;
    private readonly appState: AppState;
    private dataItemsLayer: VectorLayer;
    private labelLayer: VectorLayer;
    private selectedDataItemLayer: VectorLayer;


    constructor(private mapService: OlMapService) {
        this.appState = new AppState();
        this.appStateSubject = new BehaviorSubject(this.appState);
        this.appState$ = this.appStateSubject.asObservable();

        this.mapService.onMapInitialized.subscribe(() => this.initLayers());
        this.mapService.onDataItemMouseOver.subscribe(this.onMouseOverDataItem.bind(this));
    }


    public setIsLoading(isLoading: boolean) {
        this.appState.drIsLoading = isLoading;
        this.onStateChanged();
    }


    public updateMapCoords(mapCoords: OlMapCoords) {
        this.appState.mapCoords = mapCoords;
        this.drawDataItems();
        this.onStateChanged();
    }


    public showKanten(value: boolean) {
        this.appState.showKanten = value;
        this.drawDataItems();
        this.onStateChanged();
    }


    public showHst(value: boolean) {
        this.appState.showHst = value;
        this.drawDataItems();
        this.onStateChanged();
    }


    public showHstLabels(value: boolean) {
        this.appState.showHstLabels = value;
        this.drawDataItems();
        this.onStateChanged();
    }


    public showKantenLabels(value: boolean) {
        this.appState.showKantenLabels = value;
        this.drawDataItems();
        this.onStateChanged();
    }


    public toggleZonenXorLokalnetze() {
        this.appState.showZonenXorLokalnetze = !this.appState.showZonenXorLokalnetze;
        this.drawDataItems();
        this.onStateChanged();
    }


    public selectZonenplan(zonenplan: Zonenplan) {
        this.appState.selectedZonenplan = zonenplan;
        this.mapService.setExtent(zonenplan ? zonenplan.getExtent() : undefined);
        this.drawDataItems();
        this.onStateChanged();
    }


    public selectInterbereich(interbereich: Interbereich) {
        this.appState.selectedInterbereich = interbereich;
        this.mapService.setExtent(interbereich ? interbereich.getExtent() : undefined);
        this.drawDataItems();
        this.onStateChanged();
    }


    public selectRelationsgebiet(relationsgebiet: Relationsgebiet) {
        this.appState.selectedRelationsgebiet = relationsgebiet;
        this.mapService.setExtent(relationsgebiet ? relationsgebiet.getExtent() : undefined);
        this.drawDataItems();
        this.onStateChanged();
    }


    public updateDrData(drData: DrData) {
        this.appState.drData = drData;
        this.appState.hstQuadTree = PrecalcHelper.precalc(drData);
        this.drawDataItems();
        this.onStateChanged();
    }


    public onMouseOverDataItem(dataItem: DataItem) {
        if (dataItem === this.appState.currentMouseOverDataItem) {
            return;
        }

        this.appState.currentMouseOverDataItem = dataItem;
        this.drawSelectedItem(dataItem);
        this.onStateChanged();
    }


    private onStateChanged() {
        this.appStateSubject.next(this.appState);
    }


    private initLayers() {
        this.dataItemsLayer = this.mapService.addVectorLayer(true);
        this.labelLayer = this.mapService.addVectorLayer(true, true);
        this.selectedDataItemLayer = this.mapService.addVectorLayer(false);
    }


    // region draw

    private drawDataItems() {
        if (!this.appState.drData || !this.appState.mapCoords) {
            return;
        }

        this.dataItemsLayer.getSource().clear(true);
        this.labelLayer.getSource().clear(true);

        if (this.appState.selectedZonenplan) {
            OlZonenplan.draw(this.appState.selectedZonenplan, !this.appState.showZonenXorLokalnetze, this.dataItemsLayer);
        }

        if (this.appState.selectedInterbereich) {
            OlInterbereich.draw(this.appState.selectedInterbereich, this.dataItemsLayer);
        }

        if (this.appState.selectedRelationsgebiet) {
            OlRelationsgebiet.draw(this.appState.selectedRelationsgebiet, this.dataItemsLayer);
        }

        if (this.appState.showHst || this.appState.showKanten) {
            const hstList = this.searchHaltestellen(this.appState.mapCoords.extent, this.MAX_HST_IN_VIEW);
            const kantenList = this.appState.showKanten ? this.searchKanten(hstList) : [];
            kantenList.forEach(kante => OlKante.drawKante(kante, this.dataItemsLayer));

            const visibleHstList = this.appState.showHst ? hstList : [];
            visibleHstList.forEach(hst => OlHaltestelle.drawHst(hst, this.dataItemsLayer));

            if (this.appState.showKantenLabels) {
                kantenList.forEach(kante => OlKante.drawLabel(kante, this.labelLayer));
            }

            if (this.appState.showHstLabels) {
                visibleHstList.forEach(hst => OlHaltestelle.drawLabel(hst, this.labelLayer));
            }
        }
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
