import {fromLonLat, toLonLat} from 'ol/proj';
import {Position2d} from './position-2d';


export class OlPos {
    public static getMercator(position: Position2d): [number, number] {
        return fromLonLat([position.longitude, position.latitude]);
    }


    public static getLonLat(mercator: [number, number]): Position2d {
        const lonLat = toLonLat(mercator);
        return new Position2d(lonLat[0], lonLat[1]);
    }
}
