import {NovaDrNsResolver} from './NovaDrNsResolver';
import {Haltestelle} from '../model/Haltestelle';
import {DrMapperHaltestelle} from './DrMapperHaltestelle';
import {VoronoiHelper} from '../voronoi/voronoi-helper';
import * as JSZip from 'jszip';

export class DrMapper {
    private constructor() {
    }


    // read zipped xml file

    public static loadZipFile(file: any) {
        console.log('loading zip file...');

        JSZip.loadAsync(file).then(
            this.processZip.bind(this),
            console.error.bind(this)
        );
    }


    private static processZip(zip: JSZip) {
        for (const fileName in zip.files) {
            zip.files[fileName].async('text').then(
                this.processZipSuccess.bind(this),
                console.error.bind(this)
            );
            break;
        }
    }


    private static processZipSuccess(xmlText: string) {
        console.log('loading zip file completed');

        this.parseXmlText(xmlText);
    }

    // endregion


    // region read xml file

    public static loadXmlFile(file: any) {
        console.log('loading text file...');

        const reader = new FileReader();
        reader.onload = this.loadXmlFileSuccess.bind(this);
        reader.readAsText(file);
    }


    private static loadXmlFileSuccess(ev: FileReaderProgressEvent) {
        console.log('loading text file completed');

        this.parseXmlText(ev.target.result);
    }


    private static parseXmlText(xmlText: string) {
        console.log('parsing xml...');

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

        console.log('parsing xml completed');

        DrMapper.readDataRelease(xmlDoc);

        const hstList = DrMapper.readHaltestellen(xmlDoc);

        VoronoiHelper.calculate(hstList);
    }


    private static readDataRelease(xmlDoc: XMLDocument) {
        const xpath = '/ns2:datenrelease/metadata/datenreleaseId';
        const dr = xmlDoc.evaluate(xpath, xmlDoc.documentElement, new NovaDrNsResolver(), XPathResult.STRING_TYPE, null);

        console.log('DR version: ' + dr.stringValue);
    }


    private static readHaltestellen(xmlDoc: XMLDocument): Haltestelle[] {
        console.log('parsing haltestellen...');

        const hstList: Haltestelle[] = [];
        const xpath = '/ns2:datenrelease/subsystemNetz/haltestellen/haltestelle';
        const dr = xmlDoc.evaluate(xpath, xmlDoc.documentElement, new NovaDrNsResolver(), XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

        let node;
        while (node = dr.iterateNext()) {
            hstList.push(DrMapperHaltestelle.createHaltestelle(node));
        }

        console.log('parsing haltestellen completed (' + hstList.length + ')');

        return hstList;
    }
}
