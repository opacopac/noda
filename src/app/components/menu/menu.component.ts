import {Component, OnInit} from '@angular/core';
import {first, map} from 'rxjs/operators';
import {StorageService} from '../../services/storage.service';
import {AppStateService} from '../../services/app-state.service';
import {DrData} from '../../model/dr-data';
import {Observable} from 'rxjs';
import {NovaDrParser} from '../../nova-dr/NovaDrParser';


@Component({
    selector: 'app-load-dr',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    private readonly STAMMDATEN_JSON_URL = 'http://www.tschanz.com/noda/tmp/stammdaten.json';
    private readonly LINIEN_JSON_URL = 'http://www.tschanz.com/noda/tmp/linien.json';
    public readonly cropZones$: Observable<boolean>;


    constructor(
        private storageService: StorageService,
        private appStateService: AppStateService
    ) {
        this.cropZones$ = this.appStateService.appState$.pipe(
            map(appState => appState.cropZones)
        );
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
        const url = this.STAMMDATEN_JSON_URL + '?ver=' + Date.now();
        this.storageService.downloadTextFile(url).subscribe(response => {
            console.log('loading prepared dr completed');

            const drData = this.storageService.deserializeDrData(response);
            this.appStateService.updateDrData(drData);
            this.appStateService.setIsLoading(false);

            this.loadLinien();
        });
    }


    private loadLinien() {
        console.log('loading linien...');
        this.appStateService.setIsLoading(true);
        const url = this.LINIEN_JSON_URL + '?ver=' + Date.now();
        this.storageService.downloadTextFile(url).subscribe(response => {
            console.log('loading linien completed');
            this.appStateService.updateLinien(response);
            this.appStateService.setIsLoading(false);
        });
    }


    public exportClick() {
        this.appStateService.appState$
            .pipe(first())
            .subscribe((appState) => {
                this.storageService.exportStammdatenJson(appState.drData, 'stammdaten.json');
            });
    }


    public cropZonenToggle() {
        this.appStateService.cropZonenToggle();
    }


    public exportZonenPolygons() {
        this.appStateService.appState$
            .pipe(first())
            .subscribe((appState) => {
                const polyData = this.getZonenPolyData(appState.drData);
                const polyDataJsonString = JSON.stringify(polyData);
                this.storageService.exportJsonFile(polyDataJsonString, 'zonenpolygons.json');
            });
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

        const filename = file.name.toLowerCase();
        if (filename.endsWith('.xml')) {
            console.log('xml file detected');
            this.appStateService.setIsLoading(true);

            const parser = new NovaDrParser();
            parser.parseXmlFile(file)
                .then((drData) => {
                    this.appStateService.setIsLoading(false);
                    this.appStateService.updateDrData(drData);
                });
        } else if (filename.endsWith('.json')) {
            console.log('json file detected');
            this.appStateService.setIsLoading(true);

            const reader = new FileReader();
            reader.onload = (ev: ProgressEvent) => {
                console.log('uploading file completed');
                const drData = this.storageService.deserializeDrData(reader.result as string);
                this.appStateService.setIsLoading(false);
                this.appStateService.updateDrData(drData);
            };
            reader.readAsText(file);
        } else {
            console.log('unknown file format');
            return;
        }
    }


    private getZonenPolyData(drData: DrData): any {
        return Array.from(drData.zonenplaene.values()).map(zonenplan => {
            return {
                zonenplan: zonenplan.bezeichnung,
                zonen: zonenplan.zonen.map(zone => {
                    return {
                        code: zone.code,
                        zonenPoly: zone.polygon ? zone.polygon.toArray() : undefined,
                        hstPoly: zone.hstPolygon ? zone.hstPolygon.toArray() : undefined
                    };
                })
            };
        });
    }
}
