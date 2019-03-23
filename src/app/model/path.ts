import {Haltestelle} from './haltestelle';
import {Kante} from './kante';
import {DataItem} from './data-item';
import {DataItemType} from './data-item-type';
import {Extent2d} from '../geo/extent-2d';


export class Path implements DataItem {
    public constructor(
        public origin: Haltestelle,
        public destination: Haltestelle,
        public kanten: Kante[]
    ) {
    }


    public getType(): DataItemType {
        return DataItemType.Path;
    }


    public getHstSequence(): Haltestelle[] {
        const hstSeq: Haltestelle[] = [this.destination];

        this.kanten.forEach(kante => {
            const lastHst = hstSeq[hstSeq.length - 1];
            hstSeq.push(lastHst === kante.haltestelle1 ? kante.haltestelle2 : kante.haltestelle1);
        });

        return hstSeq;
    }


    public getExtent(): Extent2d {
        return this.kanten.reduce(
            (acc, kante) => kante.getExtent().getEnvelope(acc),
            undefined as Extent2d
        );
    }
}
