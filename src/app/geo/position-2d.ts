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


    public static calcMidPoint(pos1: Position2d, pos2: Position2d): Position2d {
        return new Position2d(
            (pos1.longitude + pos2.longitude) / 2,
            (pos1.latitude + pos2.latitude) / 2,
        );
    }


    public static fromJSON(json: Position2dJson): Position2d {
        return new Position2d(json.lon, json.lat);
    }


    public static fromArray(posArr: number[]): Position2d {
        if (!posArr || posArr.length !== 2) {
            return undefined;
        }

        return new Position2d(posArr[0], posArr[1]);
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


    public toArray(): number[] {
        return [this.longitude, this.latitude];
    }
}
