import {Style, Icon, Fill, Circle, Text, Stroke} from 'ol/style';


interface VerbundZonenColors {
    zonenplaene: string[];
    colors: ZonenColor[];
}


interface ZonenColor {
    color: string;
    zones: number[];
}


export class OlHelper {
    private static readonly verbundZonenColors: VerbundZonenColors[] = [
        {
            zonenplaene: [
                'A-Welle Abo &amp; Billett',
                'A-Welle City-Ticket',
                'A-Welle Modul-Abo',
            ],
            colors: [
                {color: '#F18B6C', zones: [514, 521, 524, 528, 531, 535, 561, 570, 573]},
                {color: '#F9C5AF', zones: [510, 518, 525, 529, 530, 532, 550, 562, 571, 574]},
                {color: '#AFB5DD', zones: [511, 513, 519, 520, 527, 534, 551, 563, 565, 572]},
                {color: '#D7D9EE', zones: [512, 522, 526, 533, 552, 560, 564]},
                {color: '#94CA9E', zones: [587, 588, 590]},
                {color: '#B5DABA', zones: [583, 585]},
                {color: '#CEE6D0', zones: [582, 584, 589]},
                {color: '#E7F3E8', zones: [580, 581, 586]},
            ]
        },
        {
            zonenplaene: [
                'Arcobaleno Billett',
                'Arcobaleno City-Ticket'
            ],
            colors: [
                {color: '#F69E80', zones: [100, 200, 300]},
                {color: '#CCA7B9', zones: [110, 240, 243, 244, 310]},
                {color: '#FAD5E5', zones: [111, 112, 113, 114, 311, 313, 314, 241, 245]},
                {color: '#ECAACC', zones: [312, 242]},
                {color: '#D4B37D', zones: [131, 210, 230, 330]},
                {color: '#FDCF91', zones: [130, 211, 212, 213, 231, 331]},
                {color: '#FFE1A5', zones: [332]},
                {color: '#AAE0F9', zones: [150, 251, 322, 325]},
                {color: '#94BBD4', zones: [320, 323]},
                {color: '#6DA8CA', zones: [250, 324, 326]},
                {color: '#6BBD98', zones: [120, 141, 143, 221]},
                {color: '#93CF9C', zones: [142]},
                {color: '#C0E1C0', zones: [121, 122, 140, 220, 222]},
            ]
        },
        {
            zonenplaene: [
                'Arcobaleno Abo',
                'Arcobaleno Modul-Abo',
            ],
            colors: [
                {color: '#F69E80', zones: [10, 20, 30]},
                {color: '#FAD5E5', zones: [11, 31, 24]},
                {color: '#FFE1A5', zones: [13, 21, 23, 33]},
                {color: '#94BBD4', zones: [15, 25, 32]},
                {color: '#C0E1C0', zones: [12, 14, 22]},
            ]
        },
        {
            zonenplaene: [
                'Frimobil Abo',
                'Frimobil Billett',
                'Frimobil City-Ticket',
                'Frimobil Modul-Abo',
                'Frimobil Überzonenplan DV MFK',
            ],
            colors: [
                {color: '#FFF34F', zones: [10, 12, 18, 20, 27, 32, 35, 42, 44, 46, 49, 50, 53, 59, 80]},
                {color: '#FCBA61', zones: [13, 21, 26, 34, 37, 41, 51, 56, 82, 84, 86]},
                {color: '#F7C1D9', zones: [11, 15, 19, 22, 30, 33, 40, 43, 52, 54, 57, 85, 87]},
                {color: '#B3DCC0', zones: [17, 23, 31, 36, 38, 58, 81, 83]},
                {color: '#C6D8EF', zones: [28, 29, 45, 93]},
                {color: '#94BAE2', zones: [14, 16, 55, 47, 92]},
            ]
        },
        {
            zonenplaene: [
                'Libero Abo',
                'Libero Billett',
                'Libero City-Ticket',
                'Libero Libero Abo ehemals ZigZag',
                'Libero Modul-Abo',
                'Libero Überzonenplan Libero Tageskarte',
            ],
            colors: [
                {color: '#FDE5C1', zones: [100, 200, 300]},
                {color: '#F8B64D', zones: [101, 201, 301]},
                {color: '#FEC210', zones: [113, 115, 130, 151, 142, 144, 162, 181, 190, 194, 216, 217, 250, 313, 321, 325, 344, 627]},
                {color: '#FED166', zones: [112, 126, 143, 146, 152, 154, 157, 177, 180, 193, 215, 252, 228, 311, 314, 322, 342]},
                {color: '#FFE2A5', zones: [124, 131, 141, 145, 153, 155, 163, 191, 195, 229, 251, 312, 341, 343, 628, 698]},
                {color: '#FEF4DB', zones: [114, 116, 125, 140, 147, 150, 156, 161, 164, 192, 196, 218, 253, 310, 315, 331, 345, 353,
                        626, 696, 699]},
                {color: '#E0E5EF', zones: [279, 281, 324, 351, 447]},
                {color: '#C3CDE0', zones: [282]},
                {color: '#A5B5CF', zones: [197, 280, 323, 352, 446, 697]},
            ]
        },
        {
            zonenplaene: [
                'Mobilis Anschlussbillett',
                'Mobilis Billett',
                'Mobilis City-Ticket',
                'Mobilis Mobilis Überzonenplan Abo',
                'Mobilis Modul-Abo'

            ],
            colors: [
                {color: '#FFFDE5', zones: [12]},
                {color: '#FEDC90', zones: [11, 17, 26, 27, 32, 36, 39, 40, 42, 45, 51, 54, 59, 61, 63, 66, 68, 70, 77, 90, 91, 94, 96,
                        101, 103, 111, 114, 115, 117, 119, 122, 125, 143, 145, 153, 156]},
                {color: '#7ECCBE', zones: [15, 25, 30, 34, 47, 52, 57, 64, 67, 72, 73, 80, 85, 92, 109, 113, 116, 123, 142, 146, 158]},
                {color: '#F8AC8D', zones: [16, 18, 21, 23, 28, 33, 35, 38, 43, 46, 53, 55, 58, 62, 69, 74, 76, 78, 81, 83,
                    112, 118, 147, 148, 154, 157]},
                {color: '#C0DFB0', zones: [19, 20, 22, 24, 31, 37, 41, 44, 48, 49, 50, 56, 60, 65, 71, 75, 79, 82, 84, 93, 95, 97,
                        102, 108, 110, 120, 121, 124, 129, 141, 144, 149, 155]},
                {color: '#C6D8EF', zones: [100, 130, 133]},
                {color: '#ADC8E8', zones: [107, 132, 134]},
                {color: '#94BAE2', zones: [105, 106, 126, 127, 131, 135]},
            ]
        },
        {
            zonenplaene: [
                'Oberengadin Billett',
            ],
            colors: [
                {color: '#FFF9B8', zones: [10, 13, 32, 42]},
                {color: '#B3E3F9', zones: [11, 31, 34, 40, 43]},
                {color: '#CCE6CA', zones: [12, 30, 33, 41]},
            ]
        },
        {
            zonenplaene: [
                'Onde verte Billett',
                'Onde verte Überzonenplan Abo',
                'Onde verte City-Ticket',
                'Onde verte Modul-Abo',
                'Onde verte Onde Verte Zone 42'
            ],
            colors: [
                {color: '#FFF685', zones: [10, 14, 20, 33]},
                {color: '#FABDA6', zones: [11, 21]},
                {color: '#B8D989', zones: [30, 66]},
                {color: '#B3DCC0', zones: [15, 31, 32]},
                {color: '#8BA6BE', zones: [65]},
                {color: '#DCE1EA', zones: [42]},
            ]
        },
        {
            zonenplaene: [
                'Ostwind Abo',
                'Ostwind Billett',
                'Ostwind City-Ticket',
                'Ostwind Modul-Abo'
            ],
            colors: [
                {color: '#FEDAAB', zones: [210, 228, 233, 235, 244, 255, 267, 270, 363, 379, 380, 389, 821, 834, 847, 848,
                        902, 905, 910, 911, 918, 925, 953, 959, 975, 995, 993, 999]},
                {color: '#89D0C8', zones: [211, 214, 226, 234, 237, 241, 247, 271, 360, 362, 366, 381, 384, 388, 810, 833, 840, 845,
                        903, 906, 912, 916, 919, 921, 958, 977, 990, 994, 998]},
                {color: '#BDC0E0', zones: [212, 227, 231, 232, 239, 245, 248, 256, 272, 368, 383, 386, 398, 830, 835, 837,
                        901, 904, 908, 915, 922, 924, 954, 974, 992, 996, 997]},
                {color: '#FBC4AE', zones: [213, 229, 230, 236, 238, 240, 242, 249, 257, 273, 361, 364, 378, 382, 387, 820,
                        907, 909, 917, 920, 923, 976, 991]},
                {color: '#B8D989', zones: [301]},
                {color: '#81C994', zones: [303, 307]},
                {color: '#CDE5C1', zones: [305]},
            ]
        },
        {
            zonenplaene: [
                'Passepartout Abo',
                'Passepartout Billett',
                'Passepartout City-Ticket',
                'Passepartout Modul-Abo'
            ],
            colors: [
                {color: '#EDEDEE', zones: [10]},
                {color: '#BCBEC0', zones: [29, 57, 76]},
                {color: '#92C6EB', zones: [31, 53, 54, 56, 73]},
                {color: '#84C98B', zones: [21, 28, 33, 42, 64, 66, 84]},
                {color: '#F68D6F', zones: [23, 37, 39, 46, 51, 55, 74]},
                {color: '#FFD887', zones: [26, 32, 41, 43, 44, 45, 47, 61, 63]},
            ]
        },
        {
            zonenplaene: [
                'ZVV Abo &amp; Billett'
            ],
            colors: [
                {color: '#F6F6F6', zones: [110, 120]},
                {color: '#A2CBEE', zones: [114, 116, 121, 134, 135, 143, 151, 160, 181]},
                {color: '#FFDC87', zones: [111, 118, 123, 130, 132, 150, 153, 161, 163, 171, 173, 180, 184]},
                {color: '#F18D6D', zones: [113, 115, 117, 122, 133, 140, 142, 152, 155, 162, 164]},
                {color: '#8BC688', zones: [112, 124, 131, 141, 154, 156, 170, 172]},
                {color: '#D4EDFC', zones: [182, 183]}
            ]
        }
    ];


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
        const zoneColorList = this.verbundZonenColors.find(vzc => vzc.zonenplaene.indexOf(zonenplan) >= 0);
        if (!zoneColorList) {
            return this.getRgbaFromColorIndex(zoneCode % 10, opacity);
        }

        let colorHex: string;
        const zoneColor = zoneColorList.colors.find(cols => cols.zones.indexOf(zoneCode) >= 0);
        if (zoneColor) {
            colorHex = zoneColor.color;
        } else {
            colorHex = '#000000';
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
