import {ChWgsConverter} from './ch-wgs-converter';

describe('ChWgsConverter', () => {
    it('correctly calculates lon/lat #1', () => {
        const chX = 100000;
        const chY = 700000;
        const chH = 600;
        const lonLatHeight = ChWgsConverter.ch2Wgs84(chY, chX, chH);

        expect(lonLatHeight[0]).toBeCloseTo(8.73050, 4);
        expect(lonLatHeight[1]).toBeCloseTo(46.04413, 4);
        expect(lonLatHeight[2]).toBeCloseTo(650.60, 1);
    });
});
