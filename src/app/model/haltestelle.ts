import {Position2d, Position2dJson} from '../geo/position-2d';
import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';
import {Kante, VerkehrsmittelTyp} from './kante';
import {QuadTreeIndexable} from '../quadtree/quadTreeIndexable';
import {Ring2d} from '../geo/ring-2d';
import {JsonSerializable} from '../shared/json-serializable';


export interface HaltestelleJson {
    id: string;
    uic: number;
    name: string;
    pos: Position2dJson;
}


export class Haltestelle implements DataItem, QuadTreeIndexable, JsonSerializable<HaltestelleJson> {
    public kantenLut: Kante[] = [];
    public ring: Ring2d;


    public constructor(
        public id: string,
        public uic: number,
        public bavName: string,
        public position: Position2d
    ) {
    }


    public static fromJSON(json: HaltestelleJson): Haltestelle {
        return new Haltestelle(
            json.id,
            json.uic,
            json.name,
            json.pos ? Position2d.fromJSON(json.pos) : undefined
        );
    }


    public getType(): DataItemType {
        return DataItemType.Haltestelle;
    }


    public getPosition(): Position2d {
        return this.position;
    }


    public getScore(): number {
        return this.kantenLut.reduce((score, kante) => score + kante.getScore(), 0);
    }


    public isActive(): boolean {
        return (
            this.kantenLut.length > 0 &&
            this.kantenLut.some(kante => kante.verkehrsmittelTyp !== VerkehrsmittelTyp.FUSSWEG)
        );
    }


    public toJSON(key: string): HaltestelleJson {
        return {
            id: this.id,
            uic: this.uic,
            name: this.bavName,
            pos: this.position.toJSON(undefined)
        };
    }
}
