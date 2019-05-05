import {QuadTreeIndexable} from './quadTreeIndexable';
import {QuadTreeNode} from './quad-tree-node';
import {Extent2d} from '../geo/extent-2d';


export class QuadTree<T extends QuadTreeIndexable> {
    private readonly rootNode: QuadTreeNode<T> = new QuadTreeNode<T>(undefined);


    constructor(
        public readonly extent: Extent2d,
        public readonly max_depth: number
    ) {
    }


    public searchItems(extent: Extent2d, approxMaxItemsWidth: number, approxMaxItemsHeight: number): T[] {
        const itemList: T[] = [];

        const minWidth = (extent.maxLon - extent.minLon) / approxMaxItemsWidth;
        const minHeight = (extent.maxLat - extent.minLat) / approxMaxItemsHeight;
        this.searchItemsInNode(extent, minWidth, minHeight, itemList, this.rootNode);

        return itemList;
    }


    private searchItemsInNode(searchExtent: Extent2d, minWidth: number, minHeight: number, itemList: T[], node: QuadTreeNode<T>) {
        const nodeExtent = this.getExtent(node);
        if (!searchExtent.intersectsExtent(nodeExtent)) {
            return;
        }

        if (node.isLeafNode() || (nodeExtent.width <= minWidth && nodeExtent.height <= minHeight)) {
            node.items.forEach(item => itemList.push(item));
        } else {
            this.searchItemsInNode(searchExtent, minWidth, minHeight, itemList, node.childNodeSW);
            this.searchItemsInNode(searchExtent, minWidth, minHeight, itemList, node.childNodeNW);
            this.searchItemsInNode(searchExtent, minWidth, minHeight, itemList, node.childNodeSE);
            this.searchItemsInNode(searchExtent, minWidth, minHeight, itemList, node.childNodeNE);
        }
    }


    public addItem(item: T) {
        if (!this.extent.containsPoint(item.getPosition())) {
            return;
        }

        this.addItemToNode(item, this.rootNode);
    }


    public addItemToNode(item: T, node: QuadTreeNode<T>) {
        if (node.items.length === 0 || this.isMaxDepth(node)) {
            node.items.push(item);
            return;
        }

        if (node.isLeafNode()) {
            node.createChildren();
            this.addToChildren(node.items[0], node);
        }

        // set lokal hirsch
        if (item.getScore() > node.items[0].getScore()) {
            node.items[0] = item;
        }

        // add to children
        this.addToChildren(item, node);
    }


    private addToChildren(item: T, node: QuadTreeNode<T>) {
        const extent = this.getExtent(node);
        const pos = item.getPosition();
        if (this.getSWExtent(extent).containsPoint(pos, false)) {
            this.addItemToNode(item, node.childNodeSW);
        } else if (this.getNWExtent(extent).containsPoint(pos, false)) {
            this.addItemToNode(item, node.childNodeNW);
        } else if (this.getSEExtent(extent).containsPoint(pos, false)) {
            this.addItemToNode(item, node.childNodeSE);
        } else {
            this.addItemToNode(item, node.childNodeNE);
        }
    }


    private isMaxDepth(node: QuadTreeNode<T>): boolean {
        return node.getDepth() >= this.max_depth;
    }


    private getExtent(node: QuadTreeNode<T>): Extent2d {
        if (!node.parentNode) {
            return this.extent;
        } else {
            const parentExtent = this.getExtent(node.parentNode);
            if (node === node.parentNode.childNodeSW) {
                return this.getSWExtent(parentExtent);
            } else if (node === node.parentNode.childNodeNW) {
                return this.getNWExtent(parentExtent);
            } else if (node === node.parentNode.childNodeSE) {
                return this.getSEExtent(parentExtent);
            } else {
                return this.getNEExtent(parentExtent);
            }
        }
    }


    private getSWExtent(extent: Extent2d): Extent2d {
        return new Extent2d(extent.minPos.longitude, extent.minPos.latitude, extent.midPos.longitude, extent.midPos.latitude);
    }


    private getNWExtent(extent: Extent2d): Extent2d {
        return new Extent2d(extent.minPos.longitude, extent.midPos.latitude, extent.midPos.longitude, extent.maxPos.latitude);
    }


    private getSEExtent(extent: Extent2d): Extent2d {
        return new Extent2d(extent.midPos.longitude, extent.minPos.latitude, extent.maxPos.longitude, extent.midPos.latitude);
    }


    private getNEExtent(extent: Extent2d): Extent2d {
        return new Extent2d(extent.midPos.longitude, extent.midPos.latitude, extent.maxPos.longitude, extent.maxPos.latitude);
    }
}
