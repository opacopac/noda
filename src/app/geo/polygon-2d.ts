import {Ring2d} from './ring-2d';


export class Polygon2d {
    public constructor(
        public outerBoundary: Ring2d,
        public holes: Ring2d[] = []
    ) {
    }
}
