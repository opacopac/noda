import {DataItemType} from './data-item-type';
import {Haltestelle} from './haltestelle';
import {DataItem} from './data-item';


export class Relationsgebiet implements DataItem {
    public haltestellenLut: Haltestelle[] = [];
    public atomicKantenLut: [Haltestelle, Haltestelle][] = [];


    public constructor(
        public nummer: number,
        public bezeichnung: string,
    ) {
    }


    public getType(): DataItemType {
        return DataItemType.Relationsgebiet;
    }
}
