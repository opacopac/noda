import {Position2d} from '../geo/position-2d';


export interface QuadTreeIndexable {
    getPosition(): Position2d;

    getScore(): number;
}
