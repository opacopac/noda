export class PairingHeap<T> {
    public constructor(
        public element: T,
        public subheaps: PairingHeap<T>[]
    ) {
    }


    public static findMin<T>(heap: PairingHeap<T>): T {
        if (!heap) {
            return undefined;
        } else {
            return heap.element;
        }
    }


    public static merge<T>(heap1: PairingHeap<T>, heap2: PairingHeap<T>, getPrio: ((T) => number)): PairingHeap<T> {
        if (!heap1) {
            return heap2;
        } else if (!heap2) {
            return heap1;
        } else if (getPrio(heap1.element) < getPrio(heap2.element)) {
            return new PairingHeap<T>(heap1.element, [heap2, ...heap1.subheaps]);
        } else {
            return new PairingHeap<T>(heap2.element, [heap1, ...heap2.subheaps]);
        }
    }


    public static insert<T>(element: T, heap: PairingHeap<T>, getPrio: ((T) => number)): PairingHeap<T> {
        return this.merge<T>(new PairingHeap<T>(element, []), heap, getPrio);
    }


    public static deleteMin<T>(heap: PairingHeap<T>, getPrio: ((T) => number)): PairingHeap<T> {
        if (!heap) {
            return undefined;
        } else {
            return this.mergePairs<T>(heap.subheaps, getPrio);
        }
    }


    private static mergePairs<T>(heapList: PairingHeap<T>[], getPrio: ((T) => number)): PairingHeap<T> {
        if (heapList.length === 0) {
            return undefined;
        } else if (heapList.length === 1) {
            return heapList[0];
        } else {
            const heap12 = this.merge<T>(heapList[0], heapList[1], getPrio);
            return this.merge<T>(heap12, this.mergePairs<T>(heapList.slice(2), getPrio), getPrio);
        }
    }
}
