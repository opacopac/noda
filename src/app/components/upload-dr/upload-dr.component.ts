import {Component, OnInit} from '@angular/core';
import {NovaDrParser} from '../../nova-dr/NovaDrParser';
import {OlMapService} from '../../services/ol-map.service';
import {DrData} from '../../model/dr-data';
import {MapFeaturesService} from '../../services/map-features.service';
import {StorageService} from '../../services/storage.service';
import {Zonenplan} from '../../model/zonenplan';


@Component({
    selector: 'app-upload-dr',
    templateUrl: './upload-dr.component.html',
    styleUrls: ['./upload-dr.component.css']
})
export class UploadDrComponent implements OnInit {
    public dataFile;


    constructor(
        private storageService: StorageService,
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


    public getHstCount(): number {
        if (this.mapFeatureService.drData) {
            return this.mapFeatureService.drData.haltestellen.size;
        } else {
            return 0;
        }
    }


    public getKantenCount(): number {
        if (this.mapFeatureService.drData) {
            return this.mapFeatureService.drData.kanten.size;
        } else {
            return 0;
        }
    }


    public getZonenCount(): number {
        if (this.mapFeatureService.drData) {
            return this.mapFeatureService.drData.zonen.size;
        } else {
            return 0;
        }
    }


    public getZonenplanList(): Zonenplan[] {
        if (this.mapFeatureService.drData) {
            return Array.from(this.mapFeatureService.drData.zonenplaene.values());
        } else {
            return [];
        }
    }


    public zonenplanChange(event: Event) {
        const idx = parseInt((event.target as HTMLSelectElement).value, 10);
        const zonenplan = idx >= 0 ? this.getZonenplanList()[idx] : undefined;
        this.mapFeatureService.selectZonenplan(zonenplan);
    }
}
