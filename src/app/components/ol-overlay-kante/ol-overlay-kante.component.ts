import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {OlOverlayBase} from '../ol-overlay-base';
import {AppStateService} from '../../services/app-state.service';
import {Position2d} from '../../geo/position-2d';
import {OlPos} from '../../geo/ol-pos';
import {Kante, VerkehrsmittelTyp} from '../../model/kante';
import {Haltestelle} from '../../model/haltestelle';


@Component({
    selector: 'app-ol-overlay-kante',
    templateUrl: './ol-overlay-kante.component.html',
    styleUrls: ['./ol-overlay-kante.component.css']
})
export class OlOverlayKanteComponent extends OlOverlayBase implements OnInit {
    public VerkehrsmittelTyp = VerkehrsmittelTyp;
    public kante: Kante;
    @ViewChild('container') container: ElementRef;


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


    public bindDataItem(kante: Kante, clickPos: Position2d) {
        if (!this.olOverlay) {
            return;
        }

        this.kante = kante;
        this.olOverlay.setPosition(kante ? OlPos.getMercator(kante.getMidPos()) : undefined);
    }


    public getKanteName(): string {
        return this.kante.haltestelle1.bavName + ' - ' + this.kante.haltestelle2.bavName;
    }


    public getParallelKanten(): Kante[] {
        return this.kante.haltestelle1.kantenLut
            .filter(otherKante => otherKante.getOtherHst(this.kante.haltestelle1) === this.kante.haltestelle2);
    }


    public selectHaltestelle(hst: Haltestelle) {
        this.appStateService.selectHaltestelle(hst);
    }
}
