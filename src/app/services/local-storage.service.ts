import {Injectable} from '@angular/core';
import {DrData} from '../model/dr-data';
import {Haltestelle} from '../model/haltestelle';
import {Zonenplan} from '../model/zonenplan';
import {Zone} from '../model/zone';
import {Kante} from '../model/kante';


@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private readonly drIdKey = 'drId';
    private readonly hstKey = 'haltestellen';
    private readonly kantenKey = 'kanten';
    private readonly zonenKey = 'zonen';
    private readonly zonenplanKey = 'zonenplaene';


    constructor() {
    }


    public storeDrData(drData: DrData) {
        return;

        localStorage.setItem(this.drIdKey, drData.drId);
        localStorage.setItem(this.hstKey, this.serializeMap<Haltestelle>(drData.haltestellen));
        localStorage.setItem(this.kantenKey, this.serializeMap<Kante>(drData.kanten));
        localStorage.setItem(this.zonenKey, this.serializeMap<Zone>(drData.zonen));
        localStorage.setItem(this.zonenplanKey, this.serializeMap<Zonenplan>(drData.zonenplaene));
    }


    public loadDrData(): DrData {
        return undefined;

        const id = localStorage.getItem(this.drIdKey);
        const hst = localStorage.getItem(this.hstKey);
        const kanten = localStorage.getItem(this.kantenKey);
        const zonen = localStorage.getItem(this.zonenKey);
        const zonenplaene = localStorage.getItem(this.zonenplanKey);

        if (!id || !hst || !kanten || !zonen || !zonenplaene) {
            return undefined;
        }

        return new DrData(
            id,
            this.deserialize<Haltestelle>(hst),
            this.deserialize<Kante>(kanten),
            this.deserialize<Zone>(zonen),
            this.deserialize<Zonenplan>(zonenplaene)
        );
    }


    private serializeMap<T>(map: Map<string, T>): string {
        return JSON.stringify(Array.from(map.entries()));
    }


    private deserialize<T>(jsonText: string): Map<string, T> {
        return new Map(JSON.parse(jsonText));
    }

}
