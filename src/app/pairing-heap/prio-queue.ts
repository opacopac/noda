import {PairingHeap} from './pairing-heap';

export class PrioQueue<T> {
    private pairingHeap: PairingHeap<T>;


    public constructor(
        public calcPrio: ((T) => number)
    ) {
    }


    public findMin(): T {
        return PairingHeap.findMin(this.pairingHeap);
    }


    public insert(item: T) {
        this.pairingHeap = PairingHeap.insert(item, this.pairingHeap, this.calcPrio);
    }


    public popMin() {
        this.pairingHeap = PairingHeap.deleteMin(this.pairingHeap, this.calcPrio);
    }
}
