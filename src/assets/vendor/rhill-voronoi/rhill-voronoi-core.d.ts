declare class Voronoi {
    compute(sites: Site[], bbox: BBox): VoronoiResult;

    reset();
}

declare interface Site {
    x: number;
    y: number;
    ext_ref?: any;
}

declare interface BBox {
    xl: number;
    xr: number;
    yt: number;
    yb: number;
}

declare interface Vertex {
    x: number;
    y: number;
}

declare interface Edge {
    todo: number;
    lSite: Site;
    rSite: Site;
    va: Vertex;
    vb: Vertex;
}

declare interface Halfedge {
    site: Site;
    edge: Edge;

    getStartpoint(): Vertex;

    getEndpoint(): Vertex;
}

declare interface Cell {
    site: Site;
    halfedges: Halfedge[];
}


declare interface VoronoiResult {
    vertices: Vertex[];
    edges: Edge[];
    cells: Cell[];
    execTime: number;
}
