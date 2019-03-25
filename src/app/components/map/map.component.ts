import {Component, OnInit, ViewChild} from '@angular/core';
import {OlMapService} from '../../services/ol-map.service';
import {Observable, Subscription} from 'rxjs';
import {AppStateService} from '../../services/app-state.service';
import {OlOverlayHaltestelleComponent} from '../ol-overlay-haltestelle/ol-overlay-haltestelle.component';
import {Haltestelle} from '../../model/haltestelle';
import {map} from 'rxjs/operators';
import {DataItemType} from '../../model/data-item-type';
import {OlOverlayKanteComponent} from '../ol-overlay-kante/ol-overlay-kante.component';
import {Kante} from '../../model/kante';


@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
    @ViewChild(OlOverlayHaltestelleComponent) mapOverlayHaltestelleComponent: OlOverlayHaltestelleComponent;
    @ViewChild(OlOverlayKanteComponent) mapOverlayKanteComponent: OlOverlayKanteComponent;
    public selectedHaltestelle$: Observable<Haltestelle>;
    private selectedHaltestelleSubscription: Subscription;
    public selectedKante$: Observable<Kante>;
    private selectedKanteSubscription: Subscription;
    private mapMovedZoomedSubscription: Subscription;
    private mapClickedSubscription: Subscription;
    private readonly targetElement = 'map';


    constructor(
        private mapService: OlMapService,
        private appStateService: AppStateService
    ) {
        this.selectedHaltestelle$ = this.appStateService.appState$.pipe(
            map(appState => appState.selectedHaltestelle)
        );

        this.selectedKante$ = this.appStateService.appState$.pipe(
            map(appState => appState.selectedKante)
        );
    }


    ngOnInit() {
        this.initSubscriptions();
        this.initMap();
    }


    private initSubscriptions() {
        this.mapService.onMapInitialized.subscribe(() => {
            this.mapOverlayHaltestelleComponent.init(this.mapService);
            this.mapOverlayKanteComponent.init(this.mapService);
        });


        this.selectedHaltestelleSubscription = this.selectedHaltestelle$.subscribe(hst => {
            this.mapOverlayHaltestelleComponent.setDataItem(hst, hst ? hst.position : undefined);
        });

        this.selectedKanteSubscription = this.selectedKante$.subscribe(kante => {
            this.mapOverlayKanteComponent.setDataItem(kante, kante ? kante.getMidPos() : undefined);
        });
    }



    private initMap() {
        this.mapService.initMap(this.targetElement);

        this.mapMovedZoomedSubscription = this.mapService.onMapCoordsChanged.subscribe(mapCoords => {
            this.appStateService.updateMapCoords(mapCoords);
        });


        this.mapClickedSubscription = this.mapService.onMapClicked.subscribe(posAndItem => {
            if (!posAndItem.dataItem) {
                this.appStateService.selectHaltestelle(undefined);
                this.appStateService.selectKante(undefined);
                return;
            }

            switch (posAndItem.dataItem.getType()) {
                case DataItemType.Haltestelle:
                    this.appStateService.selectHaltestelle(posAndItem.dataItem as Haltestelle);
                    break;
                case DataItemType.Kante:
                    this.appStateService.selectKante(posAndItem.dataItem as Kante);
                    break;
            }
        });
    }
}
