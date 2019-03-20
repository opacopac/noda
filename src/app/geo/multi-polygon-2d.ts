import {Polygon2d} from './polygon-2d';
import {isArray} from 'util';


export class MultiPolygon2d {
    public constructor(
        public polygonList: Polygon2d[]
    ) {
    }


    public static fromArray(multipolyArr: number[][][][]): MultiPolygon2d {
        if (!multipolyArr || !isArray(multipolyArr)) {
            return undefined;
        }

        return new MultiPolygon2d(
            multipolyArr.map(polyArr => Polygon2d.fromArray(polyArr))
        );
    }


    public toArray(): number[][][][] {
        return this.polygonList.map(poly => poly.toArray());
    }
}
