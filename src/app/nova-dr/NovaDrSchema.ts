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


export interface IdAttribute {
    '@_id': string;
}


// region netz

export interface NovaDrSchemaHaltestelle extends IdAttribute {
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


export interface NovaDrSchemaKante extends IdAttribute {
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


export interface NovaDrSchemaVerwaltung extends IdAttribute {
    '@_id': string;
    version: {
        '@_gueltigVon': string;
        '@_gueltigBis': string;
        '@_id': string;
        verwaltungsCode: string;
        betreiber: string;
    }[];
}


export interface NovaDrSchemaBetreiber extends IdAttribute {
    '@_id': string;
    version: {
        '@_gueltigVon': string;
        '@_gueltigBis': string;
        '@_id': string;
        name: string;
        abkuerzung: string;
    }[];
}

// endregion


// region zonen

export interface NovaDrSchemaZonenplan extends IdAttribute {
    '@_id': string;
    version: {
        '@_gueltigVon': string;
        '@_gueltigBis': string;
        '@_id': string;
        bezeichnung: string;
        prioritaet: string;
        zonen: string;
        lokalnetz: string;
        pruefeSubhaltestellen: string;
    }[];
}


export interface NovaDrSchemaZone extends IdAttribute {
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

export interface NovaDrSchemaLokalnetz extends IdAttribute {
    '@_id': string;
    version: {
        '@_gueltigVon': string;
        '@_gueltigBis': string;
        '@_id': string;
        code: string;
        bezeichnung: string;
        kanten: string;
    }[];
}

// endregion


// region inter

export interface NovaDrSchemaInterbereich extends IdAttribute {
    '@_id': string;
    version: {
        '@_gueltigVon': string;
        '@_gueltigBis': string;
        name: string;
        dvKanten: string;
        ivKanten: string;
        ankerpunkt: NovaDrSchemaAnkerpunkt[];
    }[];
}


export interface NovaDrSchemaAnkerpunkt extends IdAttribute {
    '@_id': string;
    bezeichnung: string;
    hauptHaltestelle: string;
    subHaltestellen: string;
    ankerpunktZubringer: NovaDrSchemaAnkerpunktZubringer[];
}


export interface NovaDrSchemaAnkerpunktZubringer extends IdAttribute {
    '@_id': string;
    kanten: string;
}

// endregion


// region dv

export interface NovaDrSchemaRelationsgebiet extends IdAttribute {
    '@_id': string;
    version: {
        '@_gueltigVon': string;
        '@_gueltigBis': string;
        bezeichnung: string;
        nummer: string;
    }[];
}


export interface NovaDrSchemaRtmRelation extends IdAttribute {
    '@_id': string;
    version: {
        '@_gueltigVon': string;
        '@_gueltigBis': string;
        haltestelle1: string;
        haltestelle2: string;
        relationsschluessel: NovaDrSchemaRtmRelationsSchluessel[];
        relationsgebiet: string;
    }[];
}


export interface NovaDrSchemaRtmRelationsSchluessel {
    '@_type': string;
}

// endregion
