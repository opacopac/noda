import {Injectable} from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import {DrData} from '../model/dr-data';
import {OlVerkehrsKante} from '../ol-components/OlVerkehrsKante';
import {OlHaltestelle} from '../ol-components/OlHaltestelle';
import {OlMapCoords, OlMapService} from './ol-map.service';
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
import {Dijkstra} from '../geo/dijkstra';
import {Path} from '../model/path';
import {OlPath} from '../ol-components/OlPath';
import {Linie} from '../model/linie';
import {OlLinienKante} from '../ol-components/OlLinienKante';


@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    private readonly MIN_PIXEL_PER_HST = 70;
    private readonly NAV_BAR_HEIGHT_PX = 150; // TODO

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

        this.mapService.onMapInitialized.subscribe((val) => this.initLayers());
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


    public showLinien(value: boolean) {
        this.appState.showLinien = value;
        this.drawDataItems();
        this.onStateChanged();
    }


    public toggleZonenXorLokalnetze() {
        this.appState.showZonenXorLokalnetze = !this.appState.showZonenXorLokalnetze;
        this.drawDataItems();
        this.onStateChanged();
    }


    public selectHaltestelle(hst: Haltestelle) {
        this.appState.selectedHaltestelle = hst;
        this.appState.selectedKante = undefined;
        this.onStateChanged();
    }


    public selectKante(kante: Kante) {
        this.appState.selectedKante = kante;
        this.appState.selectedHaltestelle = undefined;
        this.onStateChanged();
    }


    public selectRouteFromTo(hst: Haltestelle, isFrom: boolean) {
        if (isFrom) {
            this.appState.routeFrom = hst;
        } else {
            this.appState.routeTo = hst;
        }

        this.appState.selectedHaltestelle = undefined;
        this.appState.selectedKante = undefined;

        let path: Path;
        if (this.appState.routeFrom && this.appState.routeTo) {
            path = this.calcShortestRoute(this.appState.routeFrom, this.appState.routeTo);
        } else {
            path = undefined;
        }

        this.selectPath(path);
    }


    public selectHaltestelleSearchResult(hst: Haltestelle) {
        if (!hst) {
            return;
        }

        this.mapService.setMapPosition(hst.position, 16);
        this.appState.selectedHaltestelle = hst;
        if (!this.appState.showHst) {
            this.appState.showHst = true;
        }
        if (!this.appState.showHstLabels) {
            this.appState.showHstLabels = true;
        }
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


    public selectPath(path: Path) {
        this.appState.selectedPath = path;
        if (path) {
            this.mapService.setExtent(this.appState.selectedPath.getExtent());
        }
        this.drawDataItems();
        this.onStateChanged();
    }


    public updateDrData(drData: DrData) {
        this.appState.drData = drData;
        this.appState.hstQuadTree = PrecalcHelper.precalc(drData);
        this.drawDataItems();
        this.onStateChanged();
    }


    public updateLinien(linienJsonString: string) {
        const linienJson = JSON.parse(linienJsonString);
        this.appState.linien = Linie.fromJSON(linienJson, this.appState.drData.haltestellen, this.appState.drData.kanten);
        PrecalcHelper.createLinienLut(this.appState.linien);
        this.onStateChanged();
    }


    public onMouseOverDataItem(dataItem: DataItem) {
        if (dataItem === this.appState.currentMouseOverDataItem) {
            return;
        }

        this.appState.currentMouseOverDataItem = dataItem;
        this.drawItemSelection(dataItem);
        this.onStateChanged();
    }


    public cropZonenToggle() {
        this.appState.cropZones = !this.appState.cropZones;
        this.drawDataItems();
        this.onStateChanged();
    }


    public calcShortestRoute(hst1: Haltestelle, hst2: Haltestelle): Path {
        const d = new Dijkstra(hst1);
        const kanten = d.getShortestPath(hst2);
        return new Path(hst1, hst2, kanten);
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
            if (this.appState.cropZones) {
                PrecalcHelper.cropVoronoiCells(this.appState.selectedZonenplan);
            }
            OlZonenplan.draw(this.appState.selectedZonenplan, !this.appState.showZonenXorLokalnetze, this.dataItemsLayer);
        }

        if (this.appState.selectedInterbereich) {
            OlInterbereich.draw(this.appState.selectedInterbereich, this.dataItemsLayer);
        }

        if (this.appState.selectedRelationsgebiet) {
            OlRelationsgebiet.draw(this.appState.selectedRelationsgebiet, this.dataItemsLayer);
        }

        if (this.appState.selectedPath) {
            OlPath.draw(this.appState.selectedPath, this.dataItemsLayer, this.labelLayer);
        }

        if (this.appState.showHst || this.appState.showKanten) {
            // determine hst & kanten for drawing
            const hstList = this.appState.hstQuadTree.searchItems(
                this.appState.mapCoords.extent,
                window.innerWidth / this.MIN_PIXEL_PER_HST,
                (window.innerHeight - this.NAV_BAR_HEIGHT_PX ) / this.MIN_PIXEL_PER_HST
            );
            const kantenList = this.appState.showKanten ? this.searchKanten(hstList) : [];

            // draw kanten
            const visibleKantenList = this.appState.showKanten ? kantenList : [];
            visibleKantenList.forEach(kante => {
                if (this.appState.showLinien) {
                    OlLinienKante.draw(kante, this.dataItemsLayer);
                } else {
                    OlVerkehrsKante.draw(kante, this.dataItemsLayer);
                }
            });

            // draw haltestellen
            const visibleHstList = this.appState.showHst ? hstList : [];
            visibleHstList.forEach(hst => OlHaltestelle.drawHst(hst, this.dataItemsLayer));

            // draw haltestelle labels
            if (this.appState.showHstLabels) {
                visibleHstList.forEach(hst => OlHaltestelle.drawLabel(hst, this.labelLayer));
            }

            // draw kanten labels
            if (this.appState.showKantenLabels) {
                visibleKantenList.forEach(kante => {
                    if (this.appState.showLinien) {
                        OlLinienKante.drawLabel(kante, this.labelLayer);
                    } else {
                        OlVerkehrsKante.drawLabel(kante, this.labelLayer);
                    }
                });
            }
        }
    }


    private drawItemSelection(dataItem: DataItem) {
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


    public searchHaltestellen(query: string, maxResults = 50): Haltestelle[] {
        if (!query || !this.appState.drData) {
            return [];
        }

        query = query.trim().toLowerCase();
        const isNumericQuery = !isNaN(parseInt(query, 10));
        const hstList = Array.from(this.appState.drData.haltestellen.values());

        return hstList
            .filter(hst => (hst.bavName.toLowerCase().indexOf(query) >= 0 || hst.uic.toString().indexOf(query) >= 0))
            .sort((a, b) => {
                let idxDiff: number;
                if (isNumericQuery) {
                    idxDiff = b.uic.toString().indexOf(query) - a.uic.toString().indexOf(query);
                    if (idxDiff !== 0) {
                        return idxDiff;
                    }
                    const isChDiff = this.isCh(b) - this.isCh(a);
                    if (isChDiff !== 0) {
                        return isChDiff;
                    }
                    return a.uic - b.uic;
                } else {
                    idxDiff = a.bavName.toLowerCase().indexOf(query) - b.bavName.toLowerCase().indexOf(query);
                    if (idxDiff !== 0) {
                        return idxDiff;
                    }
                }

                return a.bavName.length - b.bavName.length;
            })
            .slice(0, maxResults);
    }


    private isCh(hst: Haltestelle): number {
        return (hst.uic > 8500000 && hst.uic < 8599999) ? 1 : 0;
    }


    private searchKanten(hstResult: Haltestelle[]): Kante[] {
        const kantenResult: Kante[] = [];

        hstResult.forEach(hst => {
            hst.kantenLut.forEach(kante => kantenResult.push(kante));
        });

        return kantenResult;
    }
}
