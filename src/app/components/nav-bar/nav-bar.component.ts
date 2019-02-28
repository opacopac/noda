import {Component, OnInit} from '@angular/core';
import {Zonenplan} from '../../model/zonenplan';
import {OlMapService} from '../../services/ol-map.service';
import {MapStateService} from '../../services/map-state.service';
import {Relationsgebiet} from '../../model/relationsgebiet';

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
        return this.mapFeatureService.drData ? this.mapFeatureService.drData.haltestellen.size : 0;
    }


    public getKantenCount(): number {
        return this.mapFeatureService.drData ? this.mapFeatureService.drData.kanten.size : 0;
    }


    public getZonenCount(): number {
        return this.mapFeatureService.drData ? this.mapFeatureService.drData.zonen.size : 0;
    }


    public getLokalnetzCount(): number {
        return this.mapFeatureService.drData ? this.mapFeatureService.drData.lokalnetze.size : 0;
    }


    public getZonenplanCount(): number {
        return this.mapFeatureService.drData ? this.mapFeatureService.drData.zonenplaene.size : 0;
    }


    public getZonenplanList(): Zonenplan[] {
        return this.mapFeatureService.drData ? Array.from(this.mapFeatureService.drData.zonenplaene.values()) : [];
    }


    public getRelationsgebietCount(): number {
        return this.mapFeatureService.drData ? this.mapFeatureService.drData.relationsgebiete.size : 0;
    }


    public getRelationsgebietList(): Relationsgebiet[] {
        return this.mapFeatureService.drData ? Array.from(this.mapFeatureService.drData.relationsgebiete.values()) : [];
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


    public showZonenSelect(value: boolean) {
        this.mapFeatureService.showZonen = value;
    }


    public zonenplanChange(event: Event) {
        const idx = parseInt((event.target as HTMLSelectElement).value, 10);
        const zonenplan = idx >= 0 ? this.getZonenplanList()[idx] : undefined;
        this.mapFeatureService.selectZonenplan(zonenplan);
    }


    public relationsgebietChange(event: Event) {
        const idx = parseInt((event.target as HTMLSelectElement).value, 10);
        const relationsgebiet = idx >= 0 ? this.getRelationsgebietList()[idx] : undefined;
        this.mapFeatureService.selectRelationsgebiet(relationsgebiet);
    }
}
