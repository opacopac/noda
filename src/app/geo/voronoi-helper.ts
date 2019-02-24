import {Haltestelle} from '../model/haltestelle';


export class VoronoiHelper {
    public static calculate(hstList: Haltestelle[]) {
        const voronoi = new Voronoi();
        const sites = this.getSitesFromHst(hstList);
        const bbox = this.getBoundingBox();
        const result = voronoi.compute(sites, bbox);
    }


    private static getBoundingBox(): BBox {
        return {
            xl: 5,
            xr: 10,
            yb: 45,
            yt: 50,
        };
    }

    private static getSitesFromHst(hstList: Haltestelle[]): Site[] {
        return hstList.map(hst => {
            return { x: hst.position.longitude, y: hst.position.latitude };
        });
    }
}
