import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';
import {StringMap, StringMapSer} from '../shared/string-map-ser';
import {Haltestelle, HaltestelleJson} from './haltestelle';
import {Kante, KanteJson} from './kante';


export interface LinieJsonEntry {
    BETR: string;
    NR: string;
    VAR: number;
    ORIG: number;
    SORT: number;
    TYP: string;
    HST1: number;
    HST2: number;
}


export class Linie implements DataItem {
    public kanten: Kante[] = [];


    public constructor(
        public betreiber: string,
        public nr: string,
        public variante: number,
        public orig: Haltestelle,
    ) {
    }


    public static getKey(betreiber: string, nr: string, variante: number): string {
        return betreiber + '_' + nr + '_' + variante;
    }


    public static fromJSON(
        json: LinieJsonEntry[],
        hstMap: StringMapSer<Haltestelle, HaltestelleJson>,
        kantenMap: StringMapSer<Kante, KanteJson>
    ): Linie[] {
        const hstUicMap = this.getHstUicMap(hstMap);
        const kanteUicMap = this.getKantenUicMap(kantenMap);
        const linieMap = new StringMap<Linie>();

        json.forEach(jsonEntry => {
            let linie: Linie;
            const key = Linie.getKey(jsonEntry.BETR, jsonEntry.NR, jsonEntry.VAR);

            if (linieMap.has(key)) {
                linie = linieMap.get(key);
            } else {
                const origHst = hstUicMap.get(jsonEntry.ORIG.toString());
                linie = new Linie(jsonEntry.BETR, jsonEntry.NR, jsonEntry.VAR, origHst);
                linieMap.set(key, linie);
            }

            const kanteKey = Linie.getKantenKey(jsonEntry.HST1, jsonEntry.HST2);
            const kante = kanteUicMap.get(kanteKey);
            if (kante) {
                linie.kanten.push(kante);
            }
        });

        return Array.from(linieMap.values());
    }


    private static getHstUicMap(hstMap: StringMapSer<Haltestelle, HaltestelleJson>): StringMap<Haltestelle> {
        const hstUicMap = new StringMap<Haltestelle>();

        hstMap.forEach(hst => {
            hstUicMap.set(hst.uic.toString(), hst);
        });

        return hstUicMap;
    }


    private static getKantenUicMap(kantenMap: StringMapSer<Kante, KanteJson>): StringMap<Kante> {
        const kantenUicMap = new StringMap<Kante>();

        kantenMap.forEach(kante => {
            kantenUicMap.set(Linie.getKantenKey(kante.haltestelle1.uic, kante.haltestelle2.uic), kante);
        });

        return kantenUicMap;
    }


    private static getKantenKey(uic1: number, uic2: number): string {
        return uic1 + '_' + uic2;
    }


    public getType(): DataItemType {
        return DataItemType.Linie;
    }
}
