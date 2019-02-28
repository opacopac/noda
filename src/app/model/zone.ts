import {DataItemType} from './data-item-type';
import {Kante} from './kante';
import {Zonelike} from './zonelike';


export class Zone extends Zonelike {
    public constructor(
        public code: number,
        public kanten: Kante[],
        public bezeichnung?: string
    ) {
        super(code, kanten, bezeichnung);
    }


    public getType(): DataItemType {
        return DataItemType.Zone;
    }
}
