import {DataItemType} from './data-item-type';
import {Kante} from './kante';
import {Zonelike} from './zonelike';


export class Lokalnetz extends Zonelike {
    public constructor(
        code: number,
        kanten: Kante[],
        bezeichnung: string,
    ) {
        super(code, kanten, bezeichnung);
    }


    public getType(): DataItemType {
        return DataItemType.Lokalnetz;
    }
}
