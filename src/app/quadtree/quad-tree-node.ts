export class QuadTreeNode<T> {
    public childNodeSE: QuadTreeNode<T> = undefined;
    public childNodeNE: QuadTreeNode<T> = undefined;
    public childNodeSW: QuadTreeNode<T> = undefined;
    public childNodeNW: QuadTreeNode<T> = undefined;
    public items: T[] = [];


    constructor(
        public readonly parentNode: QuadTreeNode<T>
    ) {
    }


    public getDepth(): number {
        let depth = 0;
        let nodeWalker = this.parentNode;
        while (nodeWalker) {
            depth++;
            nodeWalker = nodeWalker.parentNode;
        }

        return depth;
    }


    public isLeafNode(): boolean {
        return this.childNodeSW === undefined;
    }


    public createChildren() {
        this.childNodeSW = new QuadTreeNode(this);
        this.childNodeNW = new QuadTreeNode(this);
        this.childNodeSE = new QuadTreeNode(this);
        this.childNodeNE = new QuadTreeNode(this);
    }
}
