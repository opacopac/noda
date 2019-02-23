import {Component, OnInit} from '@angular/core';
import {DrMapper} from '../../dr-mapper/DrMapper';
import {VoronoiHelper} from '../../voronoi/voronoi-helper';


@Component({
    selector: 'app-upload-dr',
    templateUrl: './upload-dr.component.html',
    styleUrls: ['./upload-dr.component.css']
})
export class UploadDrComponent implements OnInit {
    public dataFile;


    constructor() {
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

        // DrMapper.loadZipFile(this.dataFile);
        DrMapper.loadXmlFile(this.dataFile);

        console.log('upload completed');
    }


    public calcVoronoiClick() {
        console.log('calculation voronoi...');

        VoronoiHelper.calculate([]);

        console.log('calculation voronoi completed');
    }

}
