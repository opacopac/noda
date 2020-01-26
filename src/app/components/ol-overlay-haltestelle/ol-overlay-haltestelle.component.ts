import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Haltestelle} from '../../model/haltestelle';
import {Position2d} from '../../geo/position-2d';
import {OlOverlayBase} from '../ol-overlay-base';
import {OlPos} from '../../geo/ol-pos';
import {AppStateService} from '../../services/app-state.service';
import {VerkehrsmittelTyp} from '../../model/kante';


@Component({
    selector: 'app-ol-overlay-haltestelle',
    templateUrl: './ol-overlay-haltestelle.component.html',
    styleUrls: ['./ol-overlay-haltestelle.component.css']
})
export class OlOverlayHaltestelleComponent extends OlOverlayBase implements OnInit {
    public VerkehrsmittelTyp = VerkehrsmittelTyp;
    public haltestelle: Haltestelle;
    @ViewChild('container', {static: true}) container: ElementRef;


    public constructor(
        cdRef: ChangeDetectorRef,
        appStateService: AppStateService
    ) {
        super(cdRef, appStateService);
    }


    ngOnInit() {
    }


    public get containerHtmlElement(): HTMLElement {
        return this.container.nativeElement;
    }


    public bindDataItem(hst: Haltestelle, clickPos: Position2d) {
        if (!this.olOverlay) {
            return;
        }

        this.haltestelle = hst;
        this.olOverlay.setPosition(hst ? OlPos.getMercator(hst.position) : undefined);
    }


    public selectRouteFrom() {
        this.appStateService.selectRouteFromTo(this.haltestelle, true);
    }


    public selectRouteTo() {
        this.appStateService.selectRouteFromTo(this.haltestelle, false);
    }
}
