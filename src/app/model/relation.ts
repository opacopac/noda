import {DataItemType} from './data-item-type';
import {DataItem} from './data-item';
import {Haltestelle, HaltestelleJson} from './haltestelle';
import {Relationsgebiet, RelationsgebietJson} from './relationsgebiet';
import {JsonSerializable} from '../shared/json-serializable';
import {StringMapSer} from '../shared/string-map-ser';


export interface RelationJson {
    id: string;
    relGebId: string;
    hsId1: string;
    hsId2: string;
}


export class Relation implements DataItem, JsonSerializable<RelationJson> {
    public constructor(
        public id: string,
        public relationsgebiet: Relationsgebiet,
        public haltestelle1: Haltestelle,
        public halstetelle2: Haltestelle,
    ) {
    }


    public static fromJSON(
        json: RelationJson,
        relGebMap: StringMapSer<Relationsgebiet, RelationsgebietJson>,
        hstMap: StringMapSer<Haltestelle, HaltestelleJson>
    ): Relation {
        return new Relation(
            json.id,
            relGebMap.get(json.relGebId),
            hstMap.get(json.hsId1),
            hstMap.get(json.hsId2)
        );
    }


    public getType(): DataItemType {
        return DataItemType.Relation;
    }


    public toJSON(key: string): RelationJson {
        return {
            id: this.id,
            relGebId: this.relationsgebiet.id,
            hsId1: this.haltestelle1.id,
            hsId2: this.halstetelle2.id
        };
    }
}
