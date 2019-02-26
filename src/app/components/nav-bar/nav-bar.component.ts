import {Component, OnInit} from '@angular/core';
import {Zonenplan} from '../../model/zonenplan';
import {OlMapService} from '../../services/ol-map.service';
import {MapStateService} from '../../services/map-state.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

    constructor(
        private mapService: OlMapService,
        private mapFeatureService: MapStateService) {
    }

    ngOnInit() {
    }


    public getHstCount(): number {
        if (this.mapFeatureService.drData) {
            return this.mapFeatureService.drData.haltestellen.size;
        } else {
            return 0;
        }
    }


    public getKantenCount(): number {
        if (this.mapFeatureService.drData) {
            return this.mapFeatureService.drData.kanten.size;
        } else {
            return 0;
        }
    }


    public getZonenCount(): number {
        if (this.mapFeatureService.drData) {
            return this.mapFeatureService.drData.zonen.size;
        } else {
            return 0;
        }
    }


    public getZonenplanList(): Zonenplan[] {
        if (this.mapFeatureService.drData) {
            return Array.from(this.mapFeatureService.drData.zonenplaene.values());
        } else {
            return [];
        }
    }


    public showHaltestellenChange(event: Event) {
        this.mapFeatureService.showHst = (event.target as HTMLInputElement).checked;
    }


    public showHaltestellenLabelsChange(event: Event) {
        this.mapFeatureService.showHstLabels = (event.target as HTMLInputElement).checked;
    }


    public showKantenChange(event: Event) {
        this.mapFeatureService.showKanten = (event.target as HTMLInputElement).checked;
    }


    public zonenplanChange(event: Event) {
        const idx = parseInt((event.target as HTMLSelectElement).value, 10);
        const zonenplan = idx >= 0 ? this.getZonenplanList()[idx] : undefined;
        this.mapFeatureService.selectZonenplan(zonenplan);
    }
}
