import {DrData} from '../model/dr-data';
import {OlMapCoords} from './ol-map.service';
import {Haltestelle} from '../model/haltestelle';
import {QuadTree} from '../quadtree/quad-tree';
import {Zonenplan} from '../model/zonenplan';
import {Relationsgebiet} from '../model/relationsgebiet';
import {Interbereich} from '../model/interbereich';
import {DataItem} from '../model/data-item';


export class AppState {
    public drData: DrData;
    public currentMouseOverDataItem: DataItem;
    public showKanten = true;
    public showZonen = true;
    public showHst = true;
    public showHstLabels = false;
    public showKantenLabels = false;
    public selectedZonenplan: Zonenplan;
    public selectedInterbereich: Interbereich;
    public selectedRelationsgebiet: Relationsgebiet;
    public hstQuadTree: QuadTree<Haltestelle>;
    public mapCoords: OlMapCoords;


    constructor() {
    }
}
