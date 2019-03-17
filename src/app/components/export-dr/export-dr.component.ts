import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {AppStateService} from '../../services/app-state.service';
import {first} from 'rxjs/operators';


@Component({
    selector: 'app-export-dr',
    templateUrl: './export-dr.component.html',
    styleUrls: ['./export-dr.component.css']
})
export class ExportDrComponent implements OnInit {
    constructor(
        private appStateService: AppStateService,
        private storageService: StorageService
    ) {
    }


    ngOnInit() {
    }


    public exportClick() {
        this.appStateService.appState$
            .pipe(first())
            .subscribe((appState) => {
                this.storageService.exportStammdatenJson(appState.drData, 'stammdaten.json');
            });
    }
}
