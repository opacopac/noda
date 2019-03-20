import {Ring2d} from './ring-2d';
import {isArray} from 'util';


export class Polygon2d {
    public constructor(
        public outerBoundary: Ring2d,
        public holes: Ring2d[] = []
    ) {
    }


    public static fromArray(polygonArr: number[][][]): Polygon2d {
        if (!polygonArr || !isArray(polygonArr)) {
            return undefined;
        }

        return new Polygon2d(
            Ring2d.fromArray(polygonArr[0]),
            polygonArr.slice(1).map(ringArr => Ring2d.fromArray(ringArr))
        );
    }


    public toArray(): number[][][] {
        return [
            this.outerBoundary.toArray(),
            ...this.holes.map(hole => hole.toArray())
        ];
    }
}
