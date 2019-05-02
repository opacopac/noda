import {Style, Icon, Fill, Circle, Text, Stroke} from 'ol/style';
import {ZoneColorHelper} from '../model/zone-color-helper';
import {Linie} from '../model/linie';


export class OlColorHelper {
    private static readonly defaultColorList = [
        '#4363d8',
        '#42d4f4',
        '#3cb44b',
        '#ffe119',
        '#f58231',
        '#e6194B',
        // '#bfef45',
        // '#911eb4',
        '#f032e6',
        '#800000',
        '#9A6324',
        '#000075',
        // '#808000',
    ];


    public static getRgbaFromVerbundZone(zonenplan: string, zoneCode: number, opacity: number): string {
        let colorHex = ZoneColorHelper.getHexColor(zonenplan, zoneCode);

        if (!colorHex) {
            colorHex = this.defaultColorList[zoneCode % 10];
        }

        return this.getRgbaFromHex(colorHex, opacity);
    }


    public static getRgbaFromLinie(linie: Linie, opacity: number): string {
        let nr = parseInt(linie.nr, 10);
        if (isNaN(nr)) {
            nr = 0;
        }
        const colorHex = this.defaultColorList[nr % 10];

        return this.getRgbaFromHex(colorHex, opacity);
    }


    public static getRgbaFromHex(colorHex: string, opacity: number): string {
        return 'rgba(' +
            this.getDecFromHex(colorHex.substr(1, 2)) + ',' +
            this.getDecFromHex(colorHex.substr(3, 2)) + ',' +
            this.getDecFromHex(colorHex.substr(5, 2)) + ',' +
            opacity + ')';
    }


    private static getDecFromHex(colorHex: string): number {
        return parseInt(colorHex, 16);
    }
}
