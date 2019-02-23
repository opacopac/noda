import {NovaDrNsResolver} from './NovaDrNsResolver';
import {Haltestelle} from '../model/Haltestelle';
import {DrMapperHaltestelle} from './DrMapperHaltestelle';
import {VoronoiHelper} from '../voronoi/voronoi-helper';

export class DrMapper {
    private constructor() {
    }


    public static parseXmlFile(event: any) {
        console.log('parsing xml file...');

        const parser = new DOMParser();
        const readXml = event.target.result;
        const xmlDoc = parser.parseFromString(readXml, 'application/xml');

        console.log('parsing xml file completed');

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
