import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {AppStateService} from '../../services/app-state.service';


@Component({
    selector: 'app-load-dr',
    templateUrl: './load-dr.component.html',
    styleUrls: ['./load-dr.component.css']
})
export class LoadDrComponent implements OnInit {
    private readonly PREPARED_DR_URL = 'http://www.tschanz.com/noda/tmp/stammdaten.json';


    constructor(
        private storageService: StorageService,
        private appStateService: AppStateService) {
    }


    ngOnInit() {
    }


    public loadDrClicked() {
        this.loadPreparedDr();
    }


    private loadPreparedDr() {
        console.log('loading prepared dr...');
        this.appStateService.setIsLoading(true);
        const url = this.PREPARED_DR_URL + '?ver=' + Date.now();
        this.storageService.downloadTextFile(url).subscribe(response => {
            console.log('loading prepared dr completed');

            const drData = this.storageService.deserializeDrData(response);
            this.appStateService.setIsLoading(false);
            this.appStateService.updateDrData(drData);
        });
    }
}
