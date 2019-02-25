import {Component, OnInit} from '@angular/core';
import {NovaDrParser} from '../../nova-dr/NovaDrParser';
import {OlMapService} from '../../services/ol-map.service';
import {DrData} from '../../model/dr-data';
import {MapStateService} from '../../services/map-state.service';
import {StorageService} from '../../services/storage.service';


@Component({
    selector: 'app-upload-dr',
    templateUrl: './upload-dr.component.html',
    styleUrls: ['./upload-dr.component.css']
})
export class UploadDrComponent implements OnInit {
    constructor(
        private storageService: StorageService,
        private mapService: OlMapService,
        private mapFeatureService: MapStateService) {
    }


    ngOnInit() {
    }


    public fileUploadChange(fileInputEvent: any) {
        const dataFile = fileInputEvent.target.files[0];
        if (!dataFile) {
            return;
        }

        console.log('uploading file...');
        console.log(dataFile);

        const drDataPromise = NovaDrParser.loadXmlFile(dataFile);
        drDataPromise.then((drData: DrData) => {
            this.storageService.storeDrData(drData);
            this.mapFeatureService.updateDrData(drData);
        });

        console.log('upload completed');
    }
}
