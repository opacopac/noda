import {Component, OnInit} from '@angular/core';
import {StorageService} from './services/storage.service';
import {MapStateService} from './services/map-state.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'NoDa';


    constructor(
        private storageService: StorageService,
        private mapFeaturesService: MapStateService
    ) {
    }


    ngOnInit(): void {
        this.storageService.loadDrData()
            .subscribe(drData => {
                if (drData) {
                    this.mapFeaturesService.updateDrData(drData);
                }
            });
    }
}
