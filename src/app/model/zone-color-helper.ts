interface ZonenplanColors {
    zonenplaene: string[];
    colors: ZonenColor[];
}


interface ZonenColor {
    color: string;
    zones: number[];
}


export class ZoneColorHelper {
    private static readonly zonenplanColors: ZonenplanColors[] = [
        {
            zonenplaene: [
                'A-Welle Abo & Billett',
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
                'BeoAbo Abo',
                'BeoAbo Modul-Abo',
            ],
            colors: [
                {color: '#EFF2F3', zones: [10, 30, 31, 32, 33, 34, 35, 50, 51, 53, 54, 71, 73, 75, 80, 92, 93, 94,
                        100, 106, 107, 113, 114, 125, 130, 131, 133, 136, 145]},
                {color: '#CCD5D9', zones: [20, 40, 41, 42, 44, 45, 60, 61, 63, 65, 81, 83, 90, 96, 97,
                        101, 102, 103, 104, 110, 115, 116, 118, 120, 123, 135, 140, 143]},
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
                'Ostwind Modul-Abo',
                'Vorarlberg OTV-VVV Abo & Billett',
                'Vorarlberg OTV-VVV Abo &amp; Billett'
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
                {color: '#97CB59', zones: [711, 713, 714, 716, 718, 720, 726, 730, 731, 733, 735, 737]},
                {color: '#CEE59A', zones: [710, 715, 723, 725, 732, 734]},
                {color: '#F1F6D3', zones: [712, 717, 722, 729, 736]},
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
                'Schwyzerpass Abo & Billett',
                'Schwyzerpass Abo &amp; Billett',
                'Schwyzerpass City-Ticket',
                'Schwyzerpass Kombi Abo Schwyz/Zug',
                'Schwyzerpass Modul-Abo',
            ],
            colors: [
                {color: '#84C779', zones: [670, 673, 682, 686, 688, 692]},
                {color: '#BFE1C2', zones: [677, 681, 684, 689, 691]},
                {color: '#FFF56D', zones: [672, 675, 675, 678, 685, 687]},
                {color: '#F8A084', zones: [671, 674, 676, 679, 683]},
            ]
        },
        {
            zonenplaene: [
                'TNW Billett',
                'TNW Triregio Billett',
            ],
            colors: [
                {color: '#FFFFFF', zones: [10]},
                {color: '#E0BF94', zones: [11, 14, 20, 22, 33, 35, 40, 42, 55, 57, 58, 70]},
                {color: '#FFE596', zones: [12, 15, 24, 28, 34, 41, 50, 51, 56, 62, 73, 78]},
                {color: '#C0D678', zones: [13, 21, 23, 26, 27, 32, 37, 43, 53, 59, 60, 66, 75]},
                {color: '#CAE7EA', zones: [25, 30, 36, 44, 45, 52, 54, 61, 65, 74, 76]},
                {color: '#97D2D3', zones: [100, 400, 700]},
                {color: '#CDC9E6', zones: [200, 500]},
                {color: '#BEDBF4', zones: [300]},
                {color: '#8ECBF0', zones: [600]},
            ]
        },
        {
            zonenplaene: [
                'Unireso Abo & Billett',
                'Unireso Abo &amp; Billett',
                'Unireso Abo@Swisspass Unireso',
                'Unireso City-Ticket',
                'Unireso Modul-Abo',
                'Unireso Unireso Tout Genève'
            ],
            colors: [
                {color: '#F2F3F4', zones: [10]},
                {color: '#FEDAB3', zones: [21]},
                {color: '#C8E9F0', zones: [22]},
                {color: '#FDE7DC', zones: [81]},
                {color: '#D4E1F2', zones: [82]},
                {color: '#E7EEAE', zones: [84]},
                {color: '#CCD2C0', zones: [85]},
                {color: '#DFCCE3', zones: [87]},
                {color: '#D3D0B2', zones: [88]},
                {color: '#FEF0C6', zones: [90]},
            ]
        },
        {
            zonenplaene: [
                'Vagabond Abo',
                'Vagabond City-Ticket',
                'Vagabond Modul-Abo',
            ],
            colors: [
                {color: '#DFBCAC', zones: [10]},
                {color: '#A2C0C1', zones: [11]},
                {color: '#B7C9E2', zones: [12]},
                {color: '#A3B4D6', zones: [13]},
                {color: '#EEDDA0', zones: [14]},
                {color: '#A0DBF1', zones: [15]},
                {color: '#9CBFD5', zones: [20]},
                {color: '#9DCFBE', zones: [21]},
                {color: '#F1CBC6', zones: [22]},
                {color: '#BBDFCB', zones: [23]},
                {color: '#E4B1AF', zones: [24]},
                {color: '#E1DFC2', zones: [30]},
                {color: '#DAB2CB', zones: [40]},
                {color: '#EDB7A4', zones: [41]},
                {color: '#E5C0B2', zones: [42]},
            ]
        },
        {
            zonenplaene: [
                'Z-Pass A-Welle-ZVV Abo & Billett',
                'Z-Pass A-Welle-ZVV Abo &amp; Billett',
                'Z-Pass Ostwind-ZVV Abo & Billett',
                'Z-Pass Ostwind-ZVV Abo &amp; Billett',
                'Z-Pass Schwyz/Zug-ZVV Abo & Billett',
                'Z-Pass Schwyz/Zug-ZVV Abo &amp; Billett',
            ],
            colors: [
                {color: '#F6F6F6', zones: [110, 120]},
                {color: '#EAF3FC', zones: [112, 124, 131, 141, 156, 170, 172]},
                {color: '#D4E6F7', zones: [111, 118, 123, 130, 132, 150, 153, 161, 163, 171, 173, 184]},
                {color: '#BCD9F3', zones: [113, 115, 117, 122, 133, 140, 142, 152, 155, 162, 164, 180]},
                {color: '#A3CCEE', zones: [114, 116, 121, 134, 135, 143, 151, 154, 160, 181]},
                {color: '#5BC5F2', zones: [182, 183]},
                {color: '#FCE0D3', zones: [510, 512, 533, 551, 561, 570]},
                {color: '#FACAB6', zones: [513, 522, 530, 534, 550, 564, 572]},
                {color: '#F7B399', zones: [518, 531, 552, 560, 562, 573]},
                {color: '#F18D6E', zones: [511, 514, 532, 535, 563, 565, 571, 574]},
                {color: '#FFF5DE', zones: [830, 838, 906, 907, 908, 909, 911, 916, 917, 920, 923, 925, 976, 991, 995]},
                {color: '#FFEDC7', zones: [810, 834, 902, 921, 953, 975, 993, 998]},
                {color: '#FFE6AF', zones: [833, 835, 840, 904, 908, 919, 922, 958, 977, 990, 994, 999]},
                {color: '#FFDC88', zones: [820, 845, 848, 901, 903, 905, 910, 912, 915, 918, 924, 954, 974, 992, 997]},
                {color: '#E1EFDE', zones: [623, 631, 670, 672, 677, 679, 684, 691]},
                {color: '#CBE3C6', zones: [612, 622, 625, 674, 676, 680, 682, 686, 689]},
                {color: '#B4D7AE', zones: [613, 621, 624, 626, 673, 683, 687]},
                {color: '#8DC689', zones: [610, 611, 632, 671, 675, 678, 681, 685, 688, 692]},
            ]
        },
        {
            zonenplaene: [
                'Zugerpass Abo & Billett',
                'Zugerpass Abo &amp; Billett',
                'Zugerpass City-Ticket',
                'Zugerpass Modul-Abo'

            ],
            colors: [
                {color: '#80C88E', zones: [610, 613, 621, 624, 637]},
                {color: '#BFE1C2', zones: [611, 623, 626, 631, 636, 638]},
                {color: '#FFE982', zones: [612, 622, 625, 632, 633, 639]},
            ]
        },
        {
            zonenplaene: [
                'ZVV Abo & Billett',
                'ZVV Abo &amp; Billett',
                'ZVV Albis-Tageskarte',
                'ZVV City-Ticket &  Modul-Abo',
                'ZVV City-Ticket &amp;  Modul-Abo',
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


    public static getHexColor(zonenplan: string, zoneCode: number): string {
        const zoneColorList = this.zonenplanColors.find(vzc => vzc.zonenplaene.indexOf(zonenplan) >= 0);
        if (!zoneColorList) {
            return undefined;
        }

        const zoneColor = zoneColorList.colors.find(cols => cols.zones.indexOf(zoneCode) >= 0);
        return zoneColor ? zoneColor.color : undefined;
    }
}
