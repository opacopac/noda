import {NovaDrSchemaMetaData} from './NovaDrSchema';


export class NovaDrParserMetadata {
    public static parseDatenreleaseId(metaData: NovaDrSchemaMetaData): string {
        return metaData.datenreleaseId;
    }
}
