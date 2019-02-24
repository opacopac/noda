import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from './services/local-storage.service';
import {MapFeaturesService} from './services/map-features.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'NoDa';


    constructor(
        private storageService: LocalStorageService,
        private mapFeaturesService: MapFeaturesService
    ) {
    }


    ngOnInit(): void {
        const drData = this.storageService.loadDrData();

        if (drData) {
            this.mapFeaturesService.updateDrData(drData);
        }
    }
}
