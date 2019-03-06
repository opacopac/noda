import {ChWgsConverter} from './ch-wgs-converter';


export class Position2d {
    public constructor(
        public longitude: number,
        public latitude: number
    ) {
    }


    public static fromChLv03(chY: number, chX: number): Position2d {
        const lonLat = ChWgsConverter.ch2Wgs84(chY, chX);
        return new Position2d(lonLat[0], lonLat[1]);
    }


    public equals(pos: Position2d): boolean {
        return (this.longitude === pos.longitude && this.latitude === pos.latitude);
    }


    public clone(): Position2d {
        return new Position2d(this.longitude, this.latitude);
    }
}
