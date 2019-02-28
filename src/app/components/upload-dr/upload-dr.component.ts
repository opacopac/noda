import {Component, OnInit} from '@angular/core';
import {NovaDrParser} from '../../nova-dr/NovaDrParser';
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
        private mapFeatureService: MapStateService) {
    }


    ngOnInit() {
    }


    public fileUploadChange(fileInputEvent: any) {
        const dataFile = fileInputEvent.target.files[0];
        if (!dataFile) {
            return;
        }

        this.uploadXmlFile(dataFile);
    }


    private uploadXmlFile(file: any) {
        console.log('uploading file...');

        const reader = new FileReader();
        reader.onload = (ev: FileReaderProgressEvent) => {
            console.log('uploading file completed');
            const drData = NovaDrParser.processContent(ev.target.result);
            this.storageService.storeDrData(drData);
            this.mapFeatureService.updateDrData(drData);
        };

        reader.readAsText(file);
    }
}
