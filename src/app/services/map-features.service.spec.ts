import {TestBed} from '@angular/core/testing';
import {MapFeaturesService} from './map-features.service';

describe('MapFeaturesService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: MapFeaturesService = TestBed.get(MapFeaturesService);
        expect(service).toBeTruthy();
    });
});
