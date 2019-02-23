export interface NovaDrSchema {
    'ns2:datenrelease': NovaDrSchemaRoot;
}


export interface NovaDrSchemaRoot {
    metadata: NovaDrSchemaMetaData;
    subsystemNetz: NovaDrSchemaNetz;
}


export interface NovaDrSchemaMetaData {
    datenreleaseId: string;
    erstellungsZeitpunkt: string;
    gueltigVon: string;
    gueltigBis: string;
    beschreibung: string;
    pflegezyklus: string;
    dump: string;
    exporterVersion: string;
}


export interface NovaDrSchemaNetz {
    netzMetaData: any;
    haltestellen: { haltestelle: NovaDrSchemaHaltestelle[] };
}


export interface NovaDrSchemaHaltestelle {
    version: {
        gueltigVon: string;
        gueltigBis: string;
        id: string;
        bavName: string;
        yKoordinate: number;
        xKoordinate: number;
        uic: number;
    };
}
