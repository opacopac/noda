import {NovaDrSchema} from './NovaDrSchema';


export class NovaDrParserMetadata {
    public static readDataReleaseFromJson(jsonDr: NovaDrSchema): string {
        return jsonDr['ns2:datenrelease'].metadata.datenreleaseId;
    }
}
