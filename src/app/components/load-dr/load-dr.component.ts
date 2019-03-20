import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {AppStateService} from '../../services/app-state.service';
import {first} from 'rxjs/operators';
import {DrData} from '../../model/dr-data';
import {NovaDrParser} from '../../nova-dr/NovaDrParser';


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
       // this.loadPreparedDr();
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


    public exportClick() {
        this.appStateService.appState$
            .pipe(first())
            .subscribe((appState) => {
                this.storageService.exportStammdatenJson(appState.drData, 'stammdaten.json');
            });
    }


    public cropZonenClick() {
        this.appStateService.cropZonen();
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

        this.appStateService.setIsLoading(true);

        const reader = new FileReader();
        reader.onload = (ev: ProgressEvent) => {
            console.log('uploading file completed');

            const filename = file.name.toLowerCase();
            let drData: DrData;
            if (filename.endsWith('.xml')) {
                console.log('xml file detected');
                drData = NovaDrParser.processXmlContent(reader.result as string);
            } else if (filename.endsWith('.json')) {
                console.log('json file detected');
                drData = this.storageService.deserializeDrData(reader.result as string);
            } else {
                console.log('unknown file format');
                return;
            }

            this.appStateService.setIsLoading(false);
            this.appStateService.updateDrData(drData);
        };

        reader.readAsText(file);
    }
}
