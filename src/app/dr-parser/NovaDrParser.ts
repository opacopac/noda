import * as fxp from 'fast-xml-parser';
import {NovaDrParserHaltestelle} from './NovaDrParserHaltestelle';
import {NovaDrParserMetadata} from './NovaDrParserMetadata';
import {NovaDrSchema} from './NovaDrSchema';
import {DrData} from '../model/dr-data';


export class NovaDrParser {
    public static loadXmlFile(file: any): Promise<DrData> {
        console.log('loading text file...');

        const reader = new FileReader();
        return new Promise<DrData>((success, error) => {
            reader.onload = (ev: FileReaderProgressEvent) => {
                console.log('loading text file completed');
                const drData = this.processContent(ev.target.result);
                success(drData);
            };

            reader.onerror = (ev: FileReaderProgressEvent) => {
                console.error(ev);
                error(ev);
            };

            reader.readAsText(file);
        });
    }


    private static processContent(xmlText: string): DrData {
        console.log('parsing xml...');
        const drJson = this.parseXmlText(xmlText);
        console.log('parsing xml completed');

        const dr = NovaDrParserMetadata.readDataReleaseFromJson(drJson);
        console.log('DR version: ' + dr);

        console.log('parsing haltestellen...');
        const hstList = NovaDrParserHaltestelle.readHaltestellenFromJson(drJson);
        console.log('parsing haltestellen completed (' + hstList.length + ')');

        return new DrData(dr, hstList);
    }


    private static parseXmlText(xmlText: string): NovaDrSchema {
        return fxp.parse(xmlText);
    }
}
