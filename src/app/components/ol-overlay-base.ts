import {ChangeDetectorRef, EventEmitter, Output} from '@angular/core';
import {OlMapService} from '../services/ol-map.service';
import {DataItem} from '../model/data-item';
import {Position2d} from '../geo/position-2d';
import Overlay from 'ol/Overlay';
import {AppStateService} from '../services/app-state.service';


export abstract class OlOverlayBase {
    @Output() close = new EventEmitter();
    public olOverlay: Overlay;


    public constructor(
        private cdRef: ChangeDetectorRef,
        protected appStateService: AppStateService
    ) {
    }


    public abstract get containerHtmlElement(): HTMLElement;


    public init(mapService: OlMapService) {
        this.olOverlay = mapService.addOverlay(this.containerHtmlElement);
    }


    public setDataItem(dataItem: DataItem, clickPos: Position2d) {
        this.bindDataItem(dataItem, clickPos);
        this.cdRef.markForCheck();
    }


    protected abstract bindDataItem(dataItem: DataItem, clickPos: Position2d);


    public closeOverlay() {
        this.olOverlay.setPosition(undefined);
        this.setDataItem(undefined, undefined);
    }


    public onCloseOverlay() {
        this.closeOverlay();
        this.close.emit();
    }
}
