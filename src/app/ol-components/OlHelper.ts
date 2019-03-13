import {Style, Icon, Fill, Circle, Text, Stroke} from 'ol/style';
import {ZoneColorHelper} from '../model/zone-color-helper';


interface VerbundZonenColors {
    zonenplaene: string[];
    colors: ZonenColor[];
}


interface ZonenColor {
    color: string;
    zones: number[];
}


export class OlHelper {
    private static readonly colorList = [
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
            colorHex = this.colorList[zoneCode % 10];
        }

        return this.getRgbaFromHex(colorHex, opacity);
    }


    public static getRgbaFromColorIndex(colorListIndex: number, opacity: number): string {
        const colorHex = this.colorList[colorListIndex];

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
