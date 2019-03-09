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


    public get midPos(): Position2d {
        return new Position2d(
            (this.maxLon + this.minLon) / 2,
            (this.maxLat + this.minLat) / 2);
    }


    public get width(): number {
        return this.maxLon - this.minLon;
    }


    public get height(): number {
        return this.maxLat - this.minLat;
    }


    public containsPoint(point: Position2d, inclUpperBoundary = true): boolean {
        if (inclUpperBoundary) {
            return (point.longitude >= this.minLon
                && point.latitude >= this.minLat
                && point.longitude <= this.maxLon
                && point.latitude <= this.maxLat);
        } else {
            return (point.longitude >= this.minLon
                && point.latitude >= this.minLat
                && point.longitude < this.maxLon
                && point.latitude < this.maxLat);
        }
    }


    public containsExtent(extent: Extent2d, inclUpperBoundary = true): boolean {
        return (this.containsPoint(extent.minPos, inclUpperBoundary)
            && this.containsPoint(extent.maxPos, inclUpperBoundary));
    }


    public intersectsExtent(extent: Extent2d, inclUpperBoundary = true): boolean {
        if (inclUpperBoundary) {
            return !(
                extent.maxLon < this.minLon
                || extent.minLon > this.maxLon
                || extent.maxLat < this.minLat
                || extent.minLat > this.maxLat
            );
        } else {
            return !(
                extent.maxLon <= this.minLon
                || extent.minLon >= this.maxLon
                || extent.maxLat <= this.minLat
                || extent.minLat >= this.maxLat
            );
        }
    }
}
