import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';
import {Haltestelle} from './haltestelle';
import {Zone} from './zone';


export class Kante implements DataItem {
    public zonenLut: Zone[] = [];


    public constructor(
        public haltestelle1: Haltestelle,
        public haltestelle2: Haltestelle,
        public verkehrsmittelTyp: string,
    ) {
    }


    public getType(): DataItemType {
        return DataItemType.Kante;
    }


    public getScore(): number {
        const lonDiff = this.haltestelle2.position.longitude - this.haltestelle1.position.longitude;
        const latDiff = this.haltestelle2.position.latitude - this.haltestelle1.position.latitude;

        return Math.sqrt(lonDiff * lonDiff + latDiff * latDiff);
    }
}
