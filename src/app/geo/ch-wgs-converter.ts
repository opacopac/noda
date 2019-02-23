/*
 formula: https://shop.swisstopo.admin.ch/de/products/geo_software/DLL_info
*/

export class ChWgsConverter {
    public static ch2Wgs84(chY: number, chX: number, chH: number = 500): [number, number, number] {
        const y = (chY - 600000) / 1000000;
        const x = (chX - 200000) / 1000000;

        const lambda = 2.6779094
            + 4.728982 * y
            + 0.791484 * y * x
            + 0.1306 * y * x * x
            - 0.0436 * y * y * y;

        const phi = 16.9023892
            + 3.238272 * x
            - 0.270978 * y * y
            - 0.002528 * x * x
            - 0.0447 * y * y * x
            - 0.0140 * x * x * x;

        const hWGSm = chH + 49.55
            - 12.60 * y
            - 22.64 * x;

        return [
            lambda * 100 / 36,
            phi * 100 / 36,
            hWGSm];
    }
}
