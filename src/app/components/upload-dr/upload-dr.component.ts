import {Component, OnInit} from '@angular/core';
import {NovaDrParser} from '../../nova-dr/NovaDrParser';
import {MapStateService} from '../../services/map-state.service';
import {StorageService} from '../../services/storage.service';
import {DrData} from '../../model/dr-data';


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
        const dataFile = fileInputEvent.target.files[0] as File;
        if (!dataFile) {
            return;
        }

        this.uploadFile(dataFile);
    }


    private uploadFile(file: File) {
        console.log('uploading file...');

        const reader = new FileReader();
        reader.onload = (ev: FileReaderProgressEvent) => {
            console.log('uploading file completed');

            const filename = file.name.toLowerCase();
            let drData: DrData;
            if (filename.endsWith('.xml')) {
                console.log('xml file detected');
                drData = NovaDrParser.processXmlContent(ev.target.result);
            } else if (filename.endsWith('.json')) {
                console.log('json file detected');
                drData = this.storageService.deserializeDrData(ev.target.result);
            } else {
                console.log('unknown file format');
                return;
            }

            this.storageService.storeDrData(drData);
            this.mapFeatureService.updateDrData(drData);
        };

        reader.readAsText(file);
    }
}
