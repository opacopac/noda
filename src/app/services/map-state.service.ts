import {Injectable} from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import {DrData} from '../model/dr-data';
import {OlKante} from '../ol-components/OlKante';
import {OlHaltestelle} from '../ol-components/OlHaltestelle';
import {OlMapCoords, OlMapService} from './ol-map.service';
import {OlZone} from '../ol-components/OlZone';
import {Extent2d} from '../geo/extent-2d';
import {Haltestelle} from '../model/haltestelle';
import {Kante} from '../model/kante';
import {QuadTree} from '../geo/quad-tree';
import {Zonenplan} from '../model/zonenplan';
import {VoronoiHelper} from '../geo/voronoi-helper';


@Injectable({
    providedIn: 'root'
})
export class MapStateService {
    public drData: DrData;
    private _showKanten = true;
    private _showHst = true;
    private _showHstLabels = false;
    private _selectedZonenplan: Zonenplan;
    private hstPrioList: Haltestelle[];
    private hstQuadTree: QuadTree<Haltestelle>;
    private mapCoords: OlMapCoords;
    private kantenLayer: VectorLayer;
    private hstLayer: VectorLayer;
    private zonenLayer: VectorLayer;


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


    public updateDrData(drData: DrData) {
        this.drData = drData;
        this.calcLUTs();
        this.updateMap();
    }


    private calcLUTs() {
        console.log('creating LUTs...');
        this.createKantenLut();
        this.createZonenLut();
        this.createZonenplanLut();
        console.log('creating LUTs completed');

        console.log('creating hst quad tree...');
        this.hstQuadTree = this.createHstQuadTree(this.drData.haltestellen);
        console.log('creating hst quad tree completed');

        console.log('creating hst prio list...');
        this.hstPrioList = this.getHstPrioList(this.drData.haltestellen);
        console.log('creating hst prio list completed');

        console.log('calculating voronoi...');
        this.calcVoronoi(this.drData.haltestellen);
        console.log('calculating voronoi completed');
    }


    private createKantenLut() {
        this.drData.kanten.forEach(kante => {
            kante.haltestelle1.kantenLut.push(kante);
            kante.haltestelle2.kantenLut.push(kante);
        });
    }


    private createZonenLut() {
        this.drData.zonen.forEach(zone => {
            zone.kanten.forEach(kante => kante.zonenLut.push(zone));
        });
    }


    private createZonenplanLut() {
        this.drData.zonenplaene.forEach(zonenplan => {
            zonenplan.zonen.forEach(zone => zone.zonenplanLut.push(zonenplan));
        });
    }


    private updateMap() {
        if (!this.drData || !this.mapCoords) {
            return;
        }

        if (!this.hstLayer || !this.kantenLayer || !this.zonenLayer) {
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

        this.drawZonen(this._selectedZonenplan);
    }


    private initLayers() {
        this.zonenLayer = this.mapService.addVectorLayer(true);
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
            const olZone = new OlZone(zone, zonenplan, this.hstLayer.getSource());
        });
    }


    private searchHaltestellen(extent: Extent2d, maxResults: number): Haltestelle[] {
        const hstResult: Haltestelle[] = [];

        for (const hst of this.hstPrioList) {
            if (hstResult.length >= maxResults) {
                break;
            } else if (extent.containsPoint(hst.position)) {
                hstResult.push(hst);
            }
        }

        console.log(hstResult.length + ' haltestellen found');

        return hstResult;
    }


    private searchKanten(hstResult: Haltestelle[]): Kante[] {
        const kantenResult: Kante[] = [];

        hstResult.forEach(hst => {
            hst.kantenLut.forEach(kante => kantenResult.push(kante));
        });

        return kantenResult;
    }


    private createHstQuadTree(hstMap: Map<string, Haltestelle>): QuadTree<Haltestelle> {
        const quad = new QuadTree<Haltestelle>(undefined, 5, 10, 45, 50);

        hstMap.forEach(hst => quad.addItem(hst));

        return quad;
    }


    private getHstPrioList(hstMap: Map<string, Haltestelle>): Haltestelle[] {
        const hstPrioList = Array.from(hstMap.values());
        hstPrioList.sort((hst1: Haltestelle, hst2: Haltestelle) => {
            return hst2.kantenLut.length - hst1.kantenLut.length;
        });

        return hstPrioList;
    }


    private calcVoronoi(hstMap: Map<string, Haltestelle>) {
        VoronoiHelper.calculate(Array.from(hstMap.values()));
    }
}
