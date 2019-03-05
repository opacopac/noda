import {Position2d} from './position-2d';


export class Ring2d {
    public constructor(
        public positionList: Position2d[],
    ) {
    }
    

    public isClockwise(): boolean {
        let areaSum = 0;

        for (let i = 0; i < this.positionList.length - 1; i++) {
            const pos1 = this.positionList[i];
            const pos2 = this.positionList[i + 1];
            areaSum += (pos2.longitude - pos1.longitude) * (pos2.latitude + pos1.latitude);
        }

        return areaSum > 0;
    }
}
