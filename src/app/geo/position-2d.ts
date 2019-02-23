import {fromLonLat} from 'ol/proj';
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



    public getMercator(): [number, number] {
        return fromLonLat([this.longitude, this.latitude]);
    }
}
