import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {MapStateService} from '../../services/map-state.service';


@Component({
    selector: 'app-export-dr',
    templateUrl: './export-dr.component.html',
    styleUrls: ['./export-dr.component.css']
})
export class ExportDrComponent implements OnInit {
    constructor(
        private mapStateService: MapStateService,
        private storageService: StorageService
    ) {
    }


    ngOnInit() {
    }


    public exportClick() {
        this.storageService.exportStammdatenJson(this.mapStateService.drData, 'stammdaten.json');
    }
}
