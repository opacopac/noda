import VectorLayer from 'ol/layer/Vector';
import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {Zonenplan} from '../model/zonenplan';
import {OlZonelike} from './OlZonelike';


export class OlZonenplan {
    public static draw(zonenplan: Zonenplan, showLokalnetze: boolean, layer: VectorLayer) {
        if (showLokalnetze) {
            zonenplan.lokalnetze.forEach(lokalnetz => OlZonelike.drawFilling(lokalnetz, layer));
            zonenplan.lokalnetze.forEach(lokalnetz => OlZonelike.drawOutline(lokalnetz, layer));
        } else {
            zonenplan.zonen.forEach(zone => OlZonelike.drawFilling(zone, layer));
            zonenplan.zonen.forEach(zone => OlZonelike.drawOutline(zone, layer));
        }
    }
}
