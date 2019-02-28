import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {MapStateService} from '../../services/map-state.service';
import {NovaDrParser} from '../../nova-dr/NovaDrParser';


@Component({
    selector: 'app-download-dr',
    templateUrl: './download-dr.component.html',
    styleUrls: ['./download-dr.component.css']
})
export class DownloadDrComponent implements OnInit {
    constructor(
        private storageService: StorageService,
        private mapFeatureService: MapStateService) {
    }


    ngOnInit() {
    }


    public downloadClick(url: string) {
        this.downloadXmlFile(url);
    }


    private downloadXmlFile(url: string) {
        console.log('downloading file...');

        this.storageService.downloadTextFile(url)
            .subscribe(content => {
                console.log('downloading file completed');
                const drData = NovaDrParser.processContent(content);
                content = undefined;
                this.storageService.storeDrData(drData);
                this.mapFeatureService.updateDrData(drData);
            });
    }
}
