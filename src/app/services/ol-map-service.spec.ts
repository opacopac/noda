import {TestBed} from '@angular/core/testing';

import {OlMapService} from './ol-map.service';

describe('OlMapService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: OlMapService = TestBed.get(OlMapService);
        expect(service).toBeTruthy();
    });
});
