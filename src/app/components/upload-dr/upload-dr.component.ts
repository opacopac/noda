import {Component, OnInit} from '@angular/core';
import {NovaDrParser} from '../../dr-parser/NovaDrParser';
import {VoronoiHelper} from '../../geo/voronoi-helper';
import {OlMapService} from '../../services/ol-map.service';
import {DrData} from '../../model/dr-data';
import {OlHaltestelle} from '../../map-components/OlHaltestelle';


@Component({
    selector: 'app-upload-dr',
    templateUrl: './upload-dr.component.html',
    styleUrls: ['./upload-dr.component.css']
})
export class UploadDrComponent implements OnInit {
    public dataFile;


    constructor(private mapService: OlMapService) {
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


    public parseFileClick() {
        console.log('uploading...');

        const drDataPromise = NovaDrParser.loadXmlFile(this.dataFile);
        drDataPromise.then((drData: DrData) => {
            const layer = this.mapService.addVectorLayer(false);

            for (const hst of drData.haltestellen) {
                const olHst = new OlHaltestelle(hst, layer.getSource());
            }
        });

        console.log('upload completed');
    }


    public calcVoronoiClick() {
        console.log('calculation voronoi...');

        VoronoiHelper.calculate([]);

        console.log('calculation voronoi completed');
    }

}
