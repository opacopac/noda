import {ChWgsConverter} from './ch-wgs-converter';
import {JsonSerializable} from '../shared/json-serializable';


export interface Position2dJson {
    lon: number;
    lat: number;
}


export class Position2d implements JsonSerializable<Position2dJson> {
    public constructor(
        public longitude: number,
        public latitude: number
    ) {
    }


    public static fromChLv03(chY: number, chX: number): Position2d {
        const lonLat = ChWgsConverter.ch2Wgs84(chY, chX);
        return new Position2d(lonLat[0], lonLat[1]);
    }


    public static fromJSON(json: Position2dJson): Position2d {
        return new Position2d(json.lon, json.lat);
    }


    public equals(pos: Position2d): boolean {
        return (this.longitude === pos.longitude && this.latitude === pos.latitude);
    }


    public clone(): Position2d {
        return new Position2d(this.longitude, this.latitude);
    }


    public toJSON(key: string): Position2dJson {
        return { lon: this.longitude, lat: this.latitude };
    }
}
