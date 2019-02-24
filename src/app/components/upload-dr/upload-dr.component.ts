import {Component, OnInit} from '@angular/core';
import {NovaDrParser} from '../../nova-dr/NovaDrParser';
import {OlMapService} from '../../services/ol-map.service';
import {DrData} from '../../model/dr-data';
import {MapFeaturesService} from '../../services/map-features.service';
import {LocalStorageService} from '../../services/local-storage.service';


@Component({
    selector: 'app-upload-dr',
    templateUrl: './upload-dr.component.html',
    styleUrls: ['./upload-dr.component.css']
})
export class UploadDrComponent implements OnInit {
    public dataFile;


    constructor(
        private storageService: LocalStorageService,
        private mapService: OlMapService,
        private mapFeatureService: MapFeaturesService) {
    }


    ngOnInit() {
    }


    public fileUploadChange(fileInputEvent: any) {
        console.log(fileInputEvent.target.files[0]);
        this.dataFile = fileInputEvent.target.files[0];
    }


    public isFileSelected(): boolean {
        return (this.dataFile !== undefined);
    }


    public loadFileClick() {
        console.log('uploading...');

        const drDataPromise = NovaDrParser.loadXmlFile(this.dataFile);
        drDataPromise.then((drData: DrData) => {
            this.storageService.storeDrData(drData);
            this.mapFeatureService.updateDrData(drData);
        });

        console.log('upload completed');
    }
}
