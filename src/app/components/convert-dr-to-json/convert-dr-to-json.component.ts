import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {NovaDrParser} from '../../nova-dr/NovaDrParser';


@Component({
    selector: 'app-convert-dr-to-json',
    templateUrl: './convert-dr-to-json.component.html',
    styleUrls: ['./convert-dr-to-json.component.css']
})
export class ConvertDrToJsonComponent implements OnInit {
    constructor(
        private storageService: StorageService) {
    }


    ngOnInit() {
    }


    public fileUploadChange(fileInputEvent: any) {
        const dataFile = fileInputEvent.target.files[0];
        if (!dataFile) {
            return;
        }

        this.convertXmlToJson(dataFile);
    }


    private convertXmlToJson(file: any) {
        console.log('uploading file...');

        const reader = new FileReader();
        reader.onload = (ev: FileReaderProgressEvent) => {
            console.log('uploading file completed');
            const drData = NovaDrParser.processXmlContent(ev.target.result);
            this.storageService.exportStammdatenJson(drData, 'stammdaten.json');
        };

        reader.readAsText(file);
    }
}
