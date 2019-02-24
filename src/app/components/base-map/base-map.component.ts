import {Component, OnInit} from '@angular/core';
import {OlMapService} from '../../services/ol-map.service';
import {Subscription} from 'rxjs';
import {MapFeaturesService} from '../../services/map-features.service';


@Component({
    selector: 'app-base-map',
    templateUrl: './base-map.component.html',
    styleUrls: ['./base-map.component.css']
})
export class BaseMapComponent implements OnInit {
    private readonly targetElement = 'map';
    private mapMovedZoomedSubscription: Subscription;

    constructor(
        private mapService: OlMapService,
        private mapFeatureService: MapFeaturesService
    ) {
    }


    ngOnInit() {
        this.initMap();
    }


    private initMap() {
        this.mapService.initMap(this.targetElement);

        this.mapMovedZoomedSubscription = this.mapService.onMapCoordsChanged.subscribe(mapCoords => {
            this.mapFeatureService.updateMapCoords(mapCoords);
        });
    }
}