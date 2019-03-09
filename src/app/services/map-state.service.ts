import {Injectable} from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import {DrData} from '../model/dr-data';
import {OlKante} from '../ol-components/OlKante';
import {OlHaltestelle} from '../ol-components/OlHaltestelle';
import {OlMapCoords, OlMapService} from './ol-map.service';
import {OlZonelike} from '../ol-components/OlZonelike';
import {Extent2d} from '../geo/extent-2d';
import {Haltestelle} from '../model/haltestelle';
import {Kante} from '../model/kante';
import {QuadTree} from '../quadtree/quad-tree';
import {Zonenplan} from '../model/zonenplan';
import {Relationsgebiet} from '../model/relationsgebiet';
import {OlRelationsgebiet} from '../ol-components/OlRelationsgebiet';
import {Interbereich} from '../model/interbereich';
import {OlInterbereich} from '../ol-components/OlInterbereich';
import {PrecalcHelper} from '../model/precalc-helper';


@Injectable({
    providedIn: 'root'
})
export class MapStateService {
    public drData: DrData;
    private _showKanten = true;
    private _showZonen = true;
    private _showHst = true;
    private _showHstLabels = false;
    private _selectedZonenplan: Zonenplan;
    private _selectedInterbereich: Interbereich;
    private _selectedRelationsgebiet: Relationsgebiet;
    private hstPrioList: Haltestelle[];
    private hstQuadTree: QuadTree<Haltestelle>;
    private mapCoords: OlMapCoords;
    private kantenLayer: VectorLayer;
    private hstLayer: VectorLayer;
    private zonenLayer: VectorLayer;
    private interbereichLayer: VectorLayer;
    private relationsgebietLayer: VectorLayer;


    public get showZonen(): boolean {
        return this._showZonen;
    }


    public set showZonen(value: boolean) {
        this._showZonen = value;
        this.updateMap();
    }


    public get showKanten(): boolean {
        return this._showKanten;
    }


    public set showKanten(value: boolean) {
        this._showKanten = value;
        this.updateMap();
    }


    public get showHst(): boolean {
        return this._showHst;
    }


    public set showHst(value: boolean) {
        this._showHst = value;
        this.updateMap();
    }


    public get showHstLabels(): boolean {
        return this._showHstLabels;
    }


    public set showHstLabels(value: boolean) {
        this._showHstLabels = value;
        this.updateMap();
    }


    constructor(private mapService: OlMapService) {
    }


    public updateMapCoords(mapCoords: OlMapCoords) {
        this.mapCoords = mapCoords;
        this.updateMap();
    }


    public selectZonenplan(zonenplan: Zonenplan) {
        this._selectedZonenplan = zonenplan;
        this.drawZonen(zonenplan);
        this.updateMap();
    }


    public selectInterbereich(interbereich: Interbereich) {
        this._selectedInterbereich = interbereich;
        this.drawInterbereich(interbereich);
        this.updateMap();
    }


    public selectRelationsgebiet(relationsgebiet: Relationsgebiet) {
        this._selectedRelationsgebiet = relationsgebiet;
        this.drawRelationsgebiet(relationsgebiet);
        this.updateMap();
    }


    public updateDrData(drData: DrData) {
        this.drData = drData;
        const quadHstList = PrecalcHelper.precalc(drData);
        this.hstQuadTree = quadHstList[0];
        this.hstPrioList = quadHstList[1];
        this.updateMap();
    }



    private updateMap() {
        if (!this.drData || !this.mapCoords) {
            return;
        }

        if (!this.hstLayer || !this.kantenLayer || !this.zonenLayer || !this.relationsgebietLayer) {
            this.initLayers();
        }

        const maxResults = this._showHstLabels ? 100 : 500;
        const hstList = this.searchHaltestellen(this.mapCoords.extent, maxResults);
        if (this._showHst)  {
            this.drawHaltestellen(hstList, this._showHstLabels);
        } else {
            this.drawHaltestellen([], false);
        }

        const kantenList = this._showKanten ? this.searchKanten(hstList) : [];
        this.drawKanten(kantenList);

        if (this._showZonen) {
            this.drawZonen(this._selectedZonenplan);
        } else {
            this.drawLokalnetze(this._selectedZonenplan);
        }
    }


    private initLayers() {
        this.zonenLayer = this.mapService.addVectorLayer(true);
        this.interbereichLayer = this.mapService.addVectorLayer(true);
        this.relationsgebietLayer = this.mapService.addVectorLayer(true);
        this.kantenLayer = this.mapService.addVectorLayer(true);
        this.hstLayer = this.mapService.addVectorLayer(true);
    }


    private drawKanten(kantenList: Kante[]) {
        this.kantenLayer.getSource().clear(true);

        kantenList.forEach(kante => {
            const olKante = new OlKante(kante, this.kantenLayer.getSource());
        });
    }


    private drawHaltestellen(hstList: Haltestelle[], showLabels: boolean) {
        this.hstLayer.getSource().clear(true);

        hstList.forEach(hst => {
            const olHst = new OlHaltestelle(hst, this.hstLayer.getSource(), showLabels);
        });
    }


    private drawZonen(zonenplan: Zonenplan) {
        this.zonenLayer.getSource().clear(true);

        if (!zonenplan) {
            return;
        }

        zonenplan.zonen.forEach(zone => {
            const olZone = new OlZonelike(zone, zonenplan, this.zonenLayer.getSource());
        });
    }


    private drawLokalnetze(zonenplan: Zonenplan) {
        this.zonenLayer.getSource().clear(true);

        if (!zonenplan) {
            return;
        }

        zonenplan.lokalnetze.forEach(lokalnetz => {
            const olLokalnetz = new OlZonelike(lokalnetz, zonenplan, this.zonenLayer.getSource());
        });
    }


    private drawInterbereich(interbereich: Interbereich) {
        this.interbereichLayer.getSource().clear(true);

        if (!interbereich) {
            return;
        }

        const olInterbereich = new OlInterbereich(interbereich, this.interbereichLayer.getSource());
    }


    private drawRelationsgebiet(relationsgebiet: Relationsgebiet) {
        this.relationsgebietLayer.getSource().clear(true);

        if (!relationsgebiet) {
            return;
        }

        const olRelationsgebiet = new OlRelationsgebiet(relationsgebiet, this.relationsgebietLayer.getSource());
    }


    private searchHaltestellen(extent: Extent2d, maxResults: number): Haltestelle[] {
        return this.hstQuadTree.searchItems(extent, maxResults);
    }


    /*private searchHaltestellen(extent: Extent2d, maxResults: number): Haltestelle[] {
        const hstResult: Haltestelle[] = [];

        for (const hst of this.hstPrioList) {
            if (hstResult.length >= maxResults) {
                break;
            } else if (extent.containsPoint(hst.position)) {
                hstResult.push(hst);
            }
        }

        return hstResult;
    }*/


    private searchKanten(hstResult: Haltestelle[]): Kante[] {
        const kantenResult: Kante[] = [];

        hstResult.forEach(hst => {
            hst.kantenLut.forEach(kante => kantenResult.push(kante));
        });

        return kantenResult;
    }
}
