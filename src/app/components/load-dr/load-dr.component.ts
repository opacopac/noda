import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {MapStateService} from '../../services/map-state.service';


@Component({
    selector: 'app-load-dr',
    templateUrl: './load-dr.component.html',
    styleUrls: ['./load-dr.component.css']
})
export class LoadDrComponent implements OnInit {
    private readonly PREPARED_DR_URL = 'http://www.tschanz.com/noda/tmp/stammdaten.json';


    constructor(
        private storageService: StorageService,
        private mapFeatureService: MapStateService) {
    }


    ngOnInit() {
    }


    public loadDrClicked() {
        this.loadPreparedDr();
    }


    private loadPreparedDr() {
        console.log('loading prepared dr...');
        this.storageService.downloadTextFile(this.PREPARED_DR_URL).subscribe(response => {
            console.log('loading prepared dr completed');

            const drData = this.storageService.deserializeDrData(response);
            this.storageService.storeDrData(drData);
            this.mapFeatureService.updateDrData(drData);
        });
    }
}
