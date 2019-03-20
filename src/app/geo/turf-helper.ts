import * as turf from '@turf/turf';
import {Position2d} from './position-2d';
import {Ring2d} from './ring-2d';
import {MultiPolygon2d} from './multi-polygon-2d';
import {Polygon2d} from './polygon-2d';


export class TurfHelper {
    private constructor() {}


    public static createCircle(center: Position2d, radius_km: number): Ring2d {
        if (!center || radius_km <= 0) {
            return undefined;
        }

        const turfCircle = turf.circle(
            turf.point(center.toArray()),
            radius_km,
            {steps: 18, units: 'kilometers'}
        );

        return Ring2d.fromArray(turfCircle.geometry.coordinates[0]);
    }


    public static unionRings(ringList: Ring2d[]): MultiPolygon2d {
        if (!ringList || ringList.length === 0) {
            return undefined;
        }

        const unionTurfPoly = turf.union(
            ...ringList
                .filter(ring => ring !== undefined)
                .map(ring => turf.polygon([ring.toArray()]))
        );

        return this.getAsMultipolygon(unionTurfPoly);
    }


    public static intersectPolygon(poly1: Polygon2d, poly2: Polygon2d): MultiPolygon2d {
        if (!poly1 || !poly2 || !poly1.outerBoundary || !poly2.outerBoundary) {
            return undefined;
        }

        const intersectTurfPoly = turf.intersect<turf.Polygon>(
            turf.polygon(poly1.toArray()),
            turf.polygon(poly2.toArray())
        );

        if (!intersectTurfPoly) {
            return;
        }

        return this.getAsMultipolygon(intersectTurfPoly);
    }


    public static intersectMultipolygon(mpoly1: MultiPolygon2d, mpoly2: MultiPolygon2d): MultiPolygon2d {
        if (!mpoly1 || !mpoly2) {
            return undefined;
        }

        const resultPoly = new MultiPolygon2d([]);

        mpoly1.polygonList.forEach(poly1 => {
            mpoly2.polygonList.forEach(poly2 => {
                const intersectPoly = this.intersectPolygon(poly1, poly2);

                if (intersectPoly) {
                    intersectPoly.polygonList.forEach(poly => resultPoly.polygonList.push(poly));
                }
            });
        });


        return resultPoly.polygonList.length > 0 ? resultPoly : undefined;
    }


    private static getAsMultipolygon(polyFeature: turf.Feature<turf.Polygon | turf.MultiPolygon>): MultiPolygon2d {
        if (!polyFeature) {
            return undefined;
        }

        if (polyFeature.geometry.type === 'Polygon') {
            return MultiPolygon2d.fromArray([polyFeature.geometry.coordinates]);
        } else if (polyFeature.geometry.type === 'MultiPolygon') {
            return MultiPolygon2d.fromArray(polyFeature.geometry.coordinates);
        } else {
            return undefined;
        }
    }
}
