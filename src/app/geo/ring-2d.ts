import {Position2d} from './position-2d';
import {Edge2d} from './edge-2d';
import {isArray} from 'util';


export class Ring2d {
    public constructor(
        public positionList: Position2d[],
    ) {
    }


    public static fromEdgeList(edgeList: Edge2d[]): Ring2d {
        const posList = [];

        posList.push(edgeList[0].pos1);
        for (let i = 0; i < edgeList.length; i++) {
            posList.push(edgeList[i].pos2);
        }

        return new Ring2d(posList);
    }


    public static fromArray(ringArr: number[][]): Ring2d {
        if (!ringArr || !isArray(ringArr)) {
            return undefined;
        }

        return new Ring2d(
            ringArr.map(posArr => Position2d.fromArray(posArr))
        );
    }


    public getEdgeList(): Edge2d[] {
        const edgeList: Edge2d[] = [];

        for (let i = 0; i < this.positionList.length - 1; i++) {
            edgeList.push(new Edge2d(this.positionList[i], this.positionList[i + 1]));
        }

        return edgeList;
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


    // using ray casting method, source: http://alienryderflex.com/polygon/
    public containsPoint(point: Position2d): boolean {
        let j = this.positionList.length - 1;
        let oddNodes = false;

        for (let i = 0; i < this.positionList.length; i++) {
            if (this.positionList[i].latitude < point.latitude && this.positionList[j].latitude >= point.latitude ||
                this.positionList[j].latitude < point.latitude && this.positionList[i].latitude >= point.latitude
            ) {
                if (this.positionList[i].longitude + (point.latitude - this.positionList[i].latitude) / (this.positionList[j].latitude
                    - this.positionList[i].latitude) * (this.positionList[j].longitude - this.positionList[i].longitude) < point.longitude
                ) {
                    oddNodes = !oddNodes;
                }
            }
            j = i;
        }

        return oddNodes;
    }


    public containsAllPoints(pointList: Position2d[]): boolean {
        for (const point of pointList) {
            if (!this.containsPoint(point)) {
                return false;
            }
        }

        return true;
    }


    public clone(): Ring2d {
        return new Ring2d(this.positionList.map(pos => pos.clone()));
    }


    public toArray(): number[][] {
        return this.positionList.map(pos => pos.toArray());
    }
}
