import {Haltestelle} from '../model/haltestelle';
import {Position2d} from './position-2d';
import {Ring2d} from './ring-2d';


export class VoronoiHelper {
    public static calculate(hstList: Haltestelle[]) {
        const voronoi = new Voronoi();
        const sites = this.getSitesFromHst(hstList);
        const bbox = this.getBoundingBox();
        const result = voronoi.compute(sites, bbox);
        this.assignPolygonsToHst(result);
    }


    private static getBoundingBox(): BBox {
        return { // TODO
            xl: 5,
            xr: 15,
            yb: 50,
            yt: 45,
        };
    }


    private static getSitesFromHst(hstList: Haltestelle[]): Site[] {
        return hstList.map(hst => {
            return { x: hst.position.longitude, y: hst.position.latitude, ext_ref: hst };
        });
    }


    private static assignPolygonsToHst(result: VoronoiResult) {
        for (const cell of result.cells) {
            if (cell.halfedges.length === 0) {
                continue;
            }

            const posList: Position2d[] = [];

            posList.push(new Position2d(
                cell.halfedges[0].getStartpoint().x,
                cell.halfedges[0].getStartpoint().y
            ));

            cell.halfedges.forEach(halfEdge => {
                posList.push(new Position2d(
                    halfEdge.getEndpoint().x,
                    halfEdge.getEndpoint().y
                ));
            });

            const hst = cell.site.ext_ref as Haltestelle;
            hst.ring = new Ring2d(posList);
        }
    }
}
