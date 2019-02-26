export interface NovaDrSchema {
    'datenrelease': NovaDrSchemaRoot;
}


export interface NovaDrSchemaRoot {
    metadata: NovaDrSchemaMetaData;
    subsystemNetz: NovaDrSchemaNetz;
    subsystemZonenModell: NovaDrSchemaZonenModell;
}


export interface NovaDrSchemaMetaData {
    '@_schemaVersion': string;
    datenreleaseId: string;
    erstellungsZeitpunkt: string;
    gueltigVon: string;
    gueltigBis: string;
    beschreibung: string;
    pflegezyklus: string;
    dump: string;
    exporterVersion: string;
}


// region netz

export interface NovaDrSchemaNetz {
    haltestellen: { haltestelle: NovaDrSchemaHaltestelle[] };
    kanten: { kante: NovaDrSchemaKante[] };
}


export interface NovaDrSchemaHaltestelle {
    '@_id': string;
    version: {
        '@_gueltigVon': string;
        '@_gueltigBis': string;
        '@_id': string;
        bavName: string;
        yKoordinate: string;
        xKoordinate: string;
        uic: string;
        subHaltestellen: string | undefined;
    }[];
}


export interface NovaDrSchemaKante {
    '@_id': string;
    version: {
        '@_gueltigVon': string;
        '@_gueltigBis': string;
        '@_id': string;
        haltestelle1: string;
        haltestelle2: string;
        verwaltung: string;
        verkehrsmittelTyp: string;
        zuschlagspflichtig: string;
        bahnersatz: string;
    }[];
}

// endregion


// region zonen

export interface NovaDrSchemaZonenModell {
    zonenplaene: { zonenplan: NovaDrSchemaZonenplan[] };
    zonen: { zone: NovaDrSchemaZone[] };
}


export interface NovaDrSchemaZonenplan {
    '@_id': string;
    version: {
        '@_gueltigVon': string;
        '@_gueltigBis': string;
        '@_id': string;
        bezeichnung: string;
        prioritaet: string;
        zonen: string;
        pruefeSubhaltestellen: string;
    }[];
}


export interface NovaDrSchemaZone {
    '@_id': string;
    version: {
        '@_gueltigVon': string;
        '@_gueltigBis': string;
        '@_id': string;
        code: string;
        zoneTyp: string;
        zonenOwner: string;
        kanteDefault: string;
        nachbarZone: string;
        zonenpreisfaktor: string;
    }[];
}

// endregion
