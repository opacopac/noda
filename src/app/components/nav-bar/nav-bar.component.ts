import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Zonenplan} from '../../model/zonenplan';
import {OlMapService} from '../../services/ol-map.service';
import {AppStateService} from '../../services/app-state.service';
import {Relationsgebiet} from '../../model/relationsgebiet';
import {Interbereich} from '../../model/interbereich';
import {BehaviorSubject, Observable} from 'rxjs';
import {debounceTime, filter, map} from 'rxjs/operators';
import {Haltestelle} from '../../model/haltestelle';
import {FormControl} from '@angular/forms';


@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
    public drId$: Observable<string>;
    public drIsLoading$: Observable<boolean>;
    public drIsLoaded$: Observable<boolean>;
    public hstCount$: Observable<number>;
    public kantenCount$: Observable<number>;
    public showHstLabels$: Observable<boolean>;
    public showKantenLabels$: Observable<boolean>;
    public zonenplanList$: Observable<Zonenplan[]>;
    public interbereicheList$: Observable<Interbereich[]>;
    public relationsgebietList$: Observable<Relationsgebiet[]>;
    public zonenXorLokalnetzeText$: Observable<string>;
    public hstSearchResults$: Observable<Haltestelle[]>;
    public hstQueryInput = new FormControl();



    constructor(
        private changeDetector: ChangeDetectorRef,
        private mapService: OlMapService,
        private appStateService: AppStateService
    ) {
        this.initObservables();
    }


    ngOnInit() {
        this.hstSearchResults$ = this.hstQueryInput.valueChanges.pipe(
            debounceTime(250),
            filter(value => value && value.length > 2),
            map(value => this.appStateService.searchHaltestellen(value, 10))
        );
    }


    private initObservables() {
        this.drIsLoaded$ = this.appStateService.appState$.pipe(
            map(appState => appState.drData !== undefined)
        );


        this.drIsLoading$ = this.appStateService.appState$.pipe(
            map(appState => appState.drIsLoading)
        );


        this.drId$ = this.appStateService.appState$.pipe(
            map(appState => appState.drData ? appState.drData.drId : '(not loaded)')
        );

        this.hstCount$ = this.appStateService.appState$.pipe(
            map(appState => appState.drData ? appState.drData.haltestellen.size : 0)
        );

        this.kantenCount$ = this.appStateService.appState$.pipe(
            map(appState => appState.drData ? appState.drData.kanten.size : 0)
        );

        this.showHstLabels$ = this.appStateService.appState$.pipe(
            map(appState => appState.showHstLabels)
        );

        this.showKantenLabels$ = this.appStateService.appState$.pipe(
            map(appState => appState.showKantenLabels)
        );

        this.zonenXorLokalnetzeText$ = this.appStateService.appState$.pipe(
            map(appState => appState.showZonenXorLokalnetze ? 'Zonen' : 'Lokalnetze')
        );

        this.zonenplanList$ = this.appStateService.appState$.pipe(
            map(appState => {
                return appState.drData ?
                    Array.from(appState.drData.zonenplaene.values())
                        .sort((a, b) => a.bezeichnung > b.bezeichnung ? 1 : -1)
                    : [];
                }
            )
        );

        this.interbereicheList$ = this.appStateService.appState$.pipe(
            map(appState => {
                    return appState.drData ?
                        Array.from(appState.drData.interbereiche.values())
                            .sort((a, b) => a.name > b.name ? 1 : -1)
                        : [];
                }
            )
        );

        this.relationsgebietList$ = this.appStateService.appState$.pipe(
            map(appState => {
                    return appState.drData ?
                        Array.from(appState.drData.relationsgebiete.values())
                            .sort((a, b) => a.bezeichnung > b.bezeichnung ? 1 : -1)
                        : [];
                }
            )
        );

        this.hstSearchResults$ = new BehaviorSubject<Haltestelle[]>([]);
    }


    public displayHstAutcompleteFn(hst?: Haltestelle): string | undefined {
        return hst ? hst.bavName + ' (' + hst.uic + ')' : undefined;
    }


    public getDisplayText(bezeichnung: string): string {
        return bezeichnung.replace(/\&amp\;/, '&');
    }


    public showHaltestellenChange(isChecked: boolean) {
        this.appStateService.showHst(isChecked);
    }


    public showHaltestellenLabelsChange(isChecked: boolean) {
        this.appStateService.showHstLabels(isChecked);
    }


    public showKantenChange(isChecked: boolean) {
        this.appStateService.showKanten(isChecked);
    }


    public hstSelected(hst: Haltestelle) {
        this.appStateService.selectHaltestelle(hst);
    }


    public showKantenLabelsChange(isChecked: boolean) {
        this.appStateService.showKantenLabels(isChecked);
    }


    public toggleZonenLokalnetzeChange() {
        this.appStateService.toggleZonenXorLokalnetze();
    }


    public zonenplanChange(zonenplan: Zonenplan) {
        this.appStateService.selectZonenplan(zonenplan);
    }


    public interbereichChange(interbereich: Interbereich) {
        this.appStateService.selectInterbereich(interbereich);
    }


    public relationsgebietChange(relationsgebiet: Relationsgebiet) {
        this.appStateService.selectRelationsgebiet(relationsgebiet);
    }
}
