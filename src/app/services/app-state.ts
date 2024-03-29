import {DrData} from '../model/dr-data';
import {OlMapCoords} from './ol-map.service';
import {Haltestelle} from '../model/haltestelle';
import {QuadTree} from '../quadtree/quad-tree';
import {Zonenplan} from '../model/zonenplan';
import {Relationsgebiet} from '../model/relationsgebiet';
import {Interbereich} from '../model/interbereich';
import {DataItem} from '../model/data-item';
import {Path} from '../model/path';
import {Kante} from '../model/kante';
import {Linie} from '../model/linie';


export class AppState {
    public drData: DrData;
    public linien: Linie[];
    public drIsLoading = false;
    public currentMouseOverDataItem: DataItem;
    public showKanten = true;
    public showZonenXorLokalnetze = true;
    public showHst = true;
    public showHstLabels = false;
    public showKantenLabels = false;
    public showLinien = true;
    public selectedZonenplan: Zonenplan;
    public selectedInterbereich: Interbereich;
    public selectedRelationsgebiet: Relationsgebiet;
    public selectedPath: Path;
    public selectedHaltestelle: Haltestelle;
    public selectedKante: Kante;
    public routeFrom: Haltestelle;
    public routeTo: Haltestelle;
    public hstQuadTree: QuadTree<Haltestelle>;
    public mapCoords: OlMapCoords;
    public cropZones = false;


    constructor() {
    }
}
