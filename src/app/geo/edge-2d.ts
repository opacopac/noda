import {Position2d} from './position-2d';


export class Edge2d {
    public constructor(
        public pos1: Position2d,
        public pos2: Position2d
    ) {
    }


    public equals(edge: Edge2d, ignoreDirection: boolean = true): boolean {
        if (this.pos1.equals(edge.pos1) && this.pos2.equals(edge.pos2)) {
            return true;
        } else if (!ignoreDirection) {
            return false;
        } else {
            return this.equalsReverse(edge);
        }
    }


    public equalsReverse(edge: Edge2d): boolean {
        return this.pos1.equals(edge.pos2) && this.pos2.equals(edge.pos1);
    }
}
