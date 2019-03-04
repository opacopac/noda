import {Style, Icon, Fill, Circle, Text, Stroke} from 'ol/style';
import {Zone} from '../model/zone';
import {Kante} from '../model/kante';


export class KanteWithZonen {
    constructor(
        public kante: Kante,
        public zonen: Zone[]
    ) {}
}


export class OlHelper {
    private static readonly colorList = [
        '#e6194B',
        '#f58231',
        '#ffe119',
        // '#bfef45',
        '#3cb44b',
        '#42d4f4',
        '#4363d8',
        // '#911eb4',
        '#f032e6',
        '#800000',
        '#9A6324',
        // '#808000',
        '#000075',
    ];


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
