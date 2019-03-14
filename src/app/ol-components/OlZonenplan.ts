import VectorLayer from 'ol/layer/Vector';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {OlComponentBase} from './OlComponentBase';
import {Zonenplan} from '../model/zonenplan';
import {OlZonelike} from './OlZonelike';


export class OlZonenplan extends OlComponentBase {
    get isSelectable(): boolean {
        return false;
    }


    public constructor(
        zonenplan: Zonenplan,
        showLokalnetze: boolean,
        zoneFillingLayer: VectorLayer,
        zoneBorderLayer: VectorLayer) {

        super();

        if (showLokalnetze) {
            zonenplan.lokalnetze.forEach(lokalnetz => {
                const olZone = new OlZonelike(lokalnetz, zonenplan, zoneFillingLayer, zoneBorderLayer);
            });
        } else {
            zonenplan.zonen.forEach(zone => {
                const olLokalnetz = new OlZonelike(zone, zonenplan, zoneFillingLayer, zoneBorderLayer);
            });
        }
    }
}
