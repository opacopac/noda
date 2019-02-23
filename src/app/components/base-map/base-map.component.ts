import {Component, OnInit} from '@angular/core';
import {OlMapService} from '../../services/ol-map.service';


@Component({
    selector: 'app-base-map',
    templateUrl: './base-map.component.html',
    styleUrls: ['./base-map.component.css']
})
export class BaseMapComponent implements OnInit {
    private readonly targetElement = 'map';


    constructor(private mapService: OlMapService) {
    }


    ngOnInit() {
        this.initMap();
    }


    private initMap() {
        this.mapService.initMap(this.targetElement);
    }
}
