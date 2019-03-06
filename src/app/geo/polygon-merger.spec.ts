import {Position2d} from './position-2d';
import {Ring2d} from './ring-2d';
import {PolygonMerger} from './polygon-merger';

describe('PolygonMerger', () => {
    let posA1, posA2, posA3, posA4: Position2d;
    let posB1, posB2, posB3, posB4: Position2d;
    let posC1, posC2, posC3, posC4: Position2d;
    let posD1, posD2, posD3, posD4: Position2d;
    let ringA, ringB, ringC, ringD: Ring2d;

    beforeEach(() => {
        posA1 = new Position2d(7, 47);
        posA2 = new Position2d(7.5, 47.5);
        posA3 = new Position2d(8, 47);
        posA4 = posA1.clone();
        ringA = new Ring2d([posA1, posA2, posA3, posA4]);

        posB1 = posA1.clone();
        posB2 = posA3.clone();
        posB3 = new Position2d(7.5, 46.5);
        posB4 = posB1.clone();
        ringB = new Ring2d([posB1, posB2, posB3, posB4]);

        posC1 = posB3.clone();
        posC2 = posB2.clone();
        posC3 = new Position2d(8.5, 46.5);
        posC4 = posC1.clone();
        ringC = new Ring2d([posC1, posC2, posC3, posC4]);

        posD1 = posB1.clone();
        posD2 = posB3.clone();
        posD3 = new Position2d(6.5, 46.5);
        posD4 = posD1.clone();
        ringD = new Ring2d([posD1, posD2, posD3, posD4]);
    });


    it('merges 2 rings', () => {
        const poly = PolygonMerger.unionAdjacentRings([ringA, ringB]);
        const newRing = poly.polygonList[0].outerBoundary;

        expect(newRing.positionList.length).toBe(5);
        expect(newRing.positionList[0]).toEqual(posA2);
        expect(newRing.positionList[1]).toEqual(posA3);
        expect(newRing.positionList[1]).toEqual(posB2);
        expect(newRing.positionList[2]).toEqual(posB3);
        expect(newRing.positionList[3]).toEqual(posA1);
        expect(newRing.positionList[3]).toEqual(posB1);
        expect(newRing.positionList[4]).toEqual(posA2);
    });


    it('merges 3 rings', () => {
        const poly = PolygonMerger.unionAdjacentRings([ringA, ringB, ringC]);
        const newRing = poly.polygonList[0].outerBoundary;

        expect(newRing.positionList.length).toBe(6);
        expect(newRing.positionList[0]).toEqual(posA2);
        expect(newRing.positionList[1]).toEqual(posA3);
        expect(newRing.positionList[1]).toEqual(posB2);
        expect(newRing.positionList[1]).toEqual(posC2);
        expect(newRing.positionList[2]).toEqual(posC3);
        expect(newRing.positionList[3]).toEqual(posB3);
        expect(newRing.positionList[3]).toEqual(posC1);
        expect(newRing.positionList[4]).toEqual(posB1);
        expect(newRing.positionList[4]).toEqual(posA1);
        expect(newRing.positionList[5]).toEqual(posA2);
    });


    it('merges 2 hourglass-rings to one polygon', () => {
        const poly = PolygonMerger.unionAdjacentRings([ringC, ringA]);
        const newRing = poly.polygonList[0].outerBoundary;

        expect(poly.polygonList.length).toBe(1);
        expect(newRing.positionList.length).toBe(7);
    });


    it('merges 2 hourglass-rings to one polygon', () => {
        const poly = PolygonMerger.unionAdjacentRings([ringA, ringC]);
        const newRing1 = poly.polygonList[0].outerBoundary;
        const newRing2 = poly.polygonList[1].outerBoundary;

        expect(poly.polygonList.length).toBe(2);
        expect(newRing1.positionList.length).toBe(4);
        expect(newRing2.positionList.length).toBe(4);
    });


    it('merges 4 rings to one polygon', () => {
        const poly = PolygonMerger.unionAdjacentRings([ringA, ringB, ringC, ringD]);
        const newRing = poly.polygonList[0].outerBoundary;

        expect(poly.polygonList.length).toBe(1);
        expect(newRing.positionList.length).toBe(7);
    });


    it('merges 4 rings to a polygon with a hole', () => {
        const ring1 = new Ring2d([
            new Position2d(0, 0),
            new Position2d(1, 1),
            new Position2d(2, 1),
            new Position2d(3, 0),
            new Position2d(0, 0),
        ]);
        const ring2 = new Ring2d([
            new Position2d(0, 0),
            new Position2d(0, 3),
            new Position2d(1, 2),
            new Position2d(1, 1),
            new Position2d(0, 0),
        ]);
        const ring3 = new Ring2d([
            new Position2d(0, 3),
            new Position2d(3, 3),
            new Position2d(2, 2),
            new Position2d(1, 2),
            new Position2d(0, 3),
        ]);
        const ring4 = new Ring2d([
            new Position2d(3, 0),
            new Position2d(2, 1),
            new Position2d(2, 2),
            new Position2d(3, 3),
            new Position2d(3, 0),
        ]);

        const poly = PolygonMerger.unionAdjacentRings([ring1, ring2, ring3, ring4]);

        expect(poly.polygonList.length).toBe(1);
        expect(poly.polygonList[0].outerBoundary.positionList.length).toBe(5);
        expect(poly.polygonList[0].holes.length).toBe(1);
        expect(poly.polygonList[0].holes[0].positionList.length).toBe(5);
    });

    it('merges 2 not overlapping rings to 2 polygons', () => {
        const ring1 = new Ring2d([
            new Position2d(0, 0),
            new Position2d(1, 1),
            new Position2d(2, 1),
            new Position2d(3, 0),
            new Position2d(0, 0),
        ]);
        const ring3 = new Ring2d([
            new Position2d(0, 3),
            new Position2d(3, 3),
            new Position2d(2, 2),
            new Position2d(1, 2),
            new Position2d(0, 3),
        ]);

        const poly = PolygonMerger.unionAdjacentRings([ring1, ring3]);

        expect(poly.polygonList.length).toBe(2);
        expect(poly.polygonList[0].outerBoundary.positionList.length).toBe(5);
        expect(poly.polygonList[1].outerBoundary.positionList.length).toBe(5);
    });

});
