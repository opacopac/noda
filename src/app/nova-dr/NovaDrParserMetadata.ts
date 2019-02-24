import {NovaDrSchema} from './NovaDrSchema';


export class NovaDrParserMetadata {
    public static parseDatenreleaseId(jsonDr: NovaDrSchema): string {
        return jsonDr.datenrelease.metadata.datenreleaseId;
    }
}
