import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';
import {Haltestelle, HaltestelleJson} from './haltestelle';
import {Zone} from './zone';
import {JsonSerializable} from '../shared/json-serializable';
import {StringMapSer} from '../shared/string-map-ser';
import {Extent2d} from '../geo/extent-2d';
import {Position2d} from '../geo/position-2d';
import {Linie} from './linie';


export enum VerkehrsmittelTyp {
    BUS,
    SCHIFF,
    BAHN,
    FUSSWEG,
    UNKNOWN
}


export interface KanteJson {
    id: string;
    hsId1: string;
    hsId2: string;
    typ: string;
    betr: string;
}


export class Kante implements DataItem, JsonSerializable<KanteJson> {
    public zonenLut: Zone[] = [];
    public parallelKanteLut: Kante[] = [];
    public linieLut: Linie[] = [];


    public constructor(
        public id: string,
        public haltestelle1: Haltestelle,
        public haltestelle2: Haltestelle,
        public verkehrsmittelTyp: VerkehrsmittelTyp,
        public betreiber: string,
    ) {
    }


    public static fromJSON(json: KanteJson, hstMap: StringMapSer<Haltestelle, HaltestelleJson>): Kante {
        return new Kante(
            json.id,
            hstMap.get(json.hsId1),
            hstMap.get(json.hsId2),
            VerkehrsmittelTyp[json.typ],
            json.betr
        );
    }


    public getType(): DataItemType {
        return DataItemType.Kante;
    }


    public getScore(): number {
        const lonDiff = this.haltestelle2.position.longitude - this.haltestelle1.position.longitude;
        const latDiff = this.haltestelle2.position.latitude - this.haltestelle1.position.latitude;

        return Math.sqrt(lonDiff * lonDiff + latDiff * latDiff);
    }


    public toJSON(key: string): KanteJson {
        return {
            id: this.id,
            hsId1: this.haltestelle1.id,
            hsId2: this.haltestelle2.id,
            typ: VerkehrsmittelTyp[this.verkehrsmittelTyp],
            betr: this.betreiber
        };
    }


    public getMidPos(): Position2d {
        return Position2d.calcMidPoint(this.haltestelle1.position, this.haltestelle2.position);
    }


    public getExtent(): Extent2d {
        return new Extent2d(
            Math.min(this.haltestelle1.position.longitude, this.haltestelle2.position.longitude),
            Math.min(this.haltestelle1.position.latitude, this.haltestelle2.position.latitude),
            Math.max(this.haltestelle1.position.longitude, this.haltestelle2.position.longitude),
            Math.max(this.haltestelle1.position.latitude, this.haltestelle2.position.latitude)
        );
    }


    public getOtherHst(hst: Haltestelle): Haltestelle {
        if (hst === this.haltestelle1) {
            return this.haltestelle2;
        } else if (hst === this.haltestelle2) {
            return this.haltestelle1;
        } else {
            return undefined;
        }
    }
}
