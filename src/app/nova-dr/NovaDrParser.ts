import * as fxp from 'fast-xml-parser';
import {NovaDrParserHaltestelle} from './NovaDrParserHaltestelle';
import {NovaDrParserMetadata} from './NovaDrParserMetadata';
import {NovaDrSchema} from './NovaDrSchema';
import {DrData} from '../model/dr-data';
import {X2jOptionsOptional} from 'fast-xml-parser';
import {NovaDrParserKante} from './NovaDrParserKante';
import {NovaDrParserZone} from './NovaDrParserZone';
import {NovaDrParserZonenplan} from './NovaDrParserZonenplan';
import {Haltestelle} from '../model/haltestelle';
import {QuadTree} from '../geo/quad-tree';


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

        const stichdatum = this.getStichdatum();
        const drId = NovaDrParserMetadata.parseDatenreleaseId(drJson);
        console.log('DR id: ' + drId);

        console.log('parsing haltestellen...');
        const hstMap = NovaDrParserHaltestelle.parseHaltestelleList(drJson, stichdatum);
        console.log('parsing haltestellen completed (' + hstMap.size + ')');

        console.log('parsing kanten...');
        const kantenMap = NovaDrParserKante.parseKanteList(drJson, stichdatum, hstMap);
        console.log('parsing kanten completed (' + kantenMap.size + ')');

        console.log('parsing zonen...');
        const zonenMap = NovaDrParserZone.parseZoneList(drJson, stichdatum, kantenMap);
        console.log('parsing zonen completed (' + zonenMap.size + ')');

        console.log('parsing zonenpläne...');
        const zonenplanMap = NovaDrParserZonenplan.parseZonenplanList(drJson, stichdatum, zonenMap);
        console.log('parsing zonenpläne completed (' + zonenplanMap.size + ')');

        return new DrData(drId, hstMap, kantenMap, zonenMap, zonenplanMap);
    }


    private static parseXmlText(xmlText: string): NovaDrSchema {
        const options: X2jOptionsOptional = {
            attributeNamePrefix: '@_',
            attrNodeName: false,
            textNodeName: '#text',
            ignoreAttributes: false,
            ignoreNameSpace: true,
            allowBooleanAttributes: false,
            parseNodeValue: false,
            parseAttributeValue: false,
            trimValues: true,
            cdataTagName: false,
            cdataPositionChar: '\\c',
            localeRange: '', // To support non english character in tag/attribute values.
            parseTrueNumberOnly: false,
            attrValueProcessor: a => a,
            tagValueProcessor : a => a
        };

        return fxp.parse(xmlText, options);
    }


    private static getStichdatum(): string {
        const today = new Date();
        const month = today.getMonth() + 1;
        const monthStr = month >= 10 ? month.toString() : '0' + month.toString();
        const day = today.getDate();
        const dayStr = day >= 10 ? day.toString() : '0' + day.toString();

        return today.getFullYear() + '-' + monthStr + '-' + dayStr;
    }
}
