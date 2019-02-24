import {Position2d} from './position-2d';


export class Extent2d {
    public constructor(
        public minLon: number,
        public minLat: number,
        public maxLon: number,
        public maxLat: number
    ) {
    }


    public get minPos(): Position2d {
        return new Position2d(this.minLon, this.minLat);
    }


    public get maxPos(): Position2d {
        return new Position2d(this.maxLon, this.maxLat);
    }


    public containsPoint(point: Position2d): boolean {
        return (this.minLon <= point.longitude
            && this.minLat <= point.latitude
            && this.maxLon >= point.longitude
            && this.maxLat >= point.latitude);
    }


    public containsExtent(extent: Extent2d): boolean {
        return (this.minLon <= extent.minLon
            && this.minLat <= extent.minLat
            && this.maxLon >= extent.maxLon
            && this.maxLat >= extent.maxLat);
    }
}
