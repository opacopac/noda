import {Position2d} from './position-2d';
import {Positionable} from './positionable';


export class QuadTree<T extends Positionable> {
    public readonly MAX_DEPTH = 6;
    public readonly BUCKET_SIZE = 25;
    public childNodeSE: QuadTree<T> = undefined;
    public childNodeNE: QuadTree<T> = undefined;
    public childNodeSW: QuadTree<T> = undefined;
    public childNodeNW: QuadTree<T> = undefined;
    public items: T[] = [];
    private readonly depth: number;


    private get hasChildren(): boolean {
        return (this.childNodeSE !== undefined);
    }


    private get isBucketFull(): boolean {
        return (
            this.hasChildren ||
            this.items.length >= this.BUCKET_SIZE
        );
    }


    private get isMaxDepth(): boolean {
        return this.depth >= this.MAX_DEPTH;
    }


    constructor(
        public readonly parentNode: QuadTree<T>,
        public readonly minLon: number,
        public readonly maxLon: number,
        public readonly minLat: number,
        public readonly maxLat: number
    ) {
        this.depth = this.getDepth();
    }


    private getDepth(): number {
        let depth = 0;
        let nodeWalker = this.parentNode;

        while (nodeWalker) {
            depth++;
            nodeWalker = nodeWalker.parentNode;
        }

        return depth;
    }


    public addItem(item: T) {
        if (!this.isBucketFull || this.isMaxDepth) {
            this.items.push(item);
            return;
        }

        if (!this.hasChildren) {
            this.splitChildren();
        }

        this.addToChildren(item);
    }


    private splitChildren() {
        const midPos = this.getMidPos();
        this.childNodeSE = new QuadTree<T>(this, this.minLon, midPos.longitude, midPos.latitude, this.maxLat);
        this.childNodeNE = new QuadTree<T>(this, this.minLon, midPos.longitude, this.minLat, midPos.latitude);
        this.childNodeSW = new QuadTree<T>(this, midPos.longitude, this.maxLon, this.minLat, midPos.latitude);
        this.childNodeNW = new QuadTree<T>(this, midPos.longitude, this.maxLon, midPos.latitude, this.maxLat);

        this.items.forEach(item => this.addToChildren(item));
        this.items = [];
    }


    private addToChildren(item: T) {
        const pos = item.getPosition();
        const midPos = this.getMidPos();

        if (pos.longitude < midPos.longitude && pos.latitude < midPos.latitude) {
            this.childNodeSE.addItem(item);
        } else if (pos.longitude < midPos.longitude && pos.latitude >= midPos.latitude) {
            this.childNodeNE.addItem(item);
        } else if (pos.longitude >= midPos.longitude && pos.latitude < midPos.latitude) {
            this.childNodeSW.addItem(item);
        } else {
            this.childNodeNW.addItem(item);
        }
    }


    private getMidPos() {
        return new Position2d(
            (this.maxLon + this.minLon) / 2,
            (this.maxLat + this.minLat) / 2);
    }
}
