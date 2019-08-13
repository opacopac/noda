import {DrData} from '../model/dr-data';
import {ResultElement, TargetElement, SaxXml2JsonClipper} from '../shared/saxXml2JsonClipper';
import {NovaDrParserMetadata} from './NovaDrParserMetadata';
import {NovaDrParserBetreiber} from './NovaDrParserBetreiber';
import {NovaDrParserVerwaltung} from './NovaDrParserVerwaltung';
import {NovaDrParserHaltestelle} from './NovaDrParserHaltestelle';
import {NovaDrParserKante} from './NovaDrParserKante';
import {NovaDrParserZone} from './NovaDrParserZone';
import {NovaDrParserLokalnetz} from './NovaDrParserLokalnetz';
import {NovaDrParserZonenplan} from './NovaDrParserZonenplan';
import {NovaDrParserInterbereich} from './NovaDrParserInterbereich';
import {NovaDrParserRelationsgebiet} from './NovaDrParserRelationsgebiet';
import {NovaDrParserRelation} from './NovaDrParserRelation';



export class NovaDrParser {
    private readonly targetElementList: TargetElement[] = [
        { key: 'metadata', elementPath: ['ns2:datenrelease', 'metadata'] },
        { key: 'partner', elementPath: ['ns2:datenrelease', 'subsystemFQF', 'partners', 'partner'] },
        { key: 'betreiber', elementPath: ['ns2:datenrelease', 'subsystemNetz', 'betreibers', 'betreiber'] },
        { key: 'hst', elementPath: ['ns2:datenrelease', 'subsystemNetz', 'haltestellen', 'haltestelle'] },
        { key: 'kante', elementPath: ['ns2:datenrelease', 'subsystemNetz', 'kanten', 'kante'] },
        { key: 'verwaltung', elementPath: ['ns2:datenrelease', 'subsystemNetz', 'verwaltungen', 'verwaltung'] },
        { key: 'zonenplan', elementPath: ['ns2:datenrelease', 'subsystemZonenModell', 'zonenplaene', 'zonenplan'] },
        { key: 'zone', elementPath: ['ns2:datenrelease', 'subsystemZonenModell', 'zonen', 'zone'] },
        { key: 'lokalnetz', elementPath: ['ns2:datenrelease', 'subsystemZonenModell', 'lokalnetzen', 'lokalnetz'] },
        { key: 'relationsgebiet', elementPath: ['ns2:datenrelease', 'subsystemDVModell', 'relationsgebiete', 'relationsgebiet'] },
        { key: 'relation', elementPath: ['ns2:datenrelease', 'subsystemDVModell', 'rtmRelationen', 'rtmRelation'] },
        { key: 'interbereich', elementPath: ['ns2:datenrelease', 'subsystemInterModell', 'interBereiche', 'interBereich'] },
    ];

    private resultElementList = {};

    public parseXmlFile(file: File): Promise<DrData> {
        return new Promise<DrData>((resolve, reject) => {
            const parser = new SaxXml2JsonClipper(file, this.targetElementList);
            const elementStream$ = parser.parse();
            elementStream$.subscribe(
                (element: ResultElement) => this.onElementFound(element),
                (error) => reject(error),
                () => {
                    const drData = this.parseElements();
                    resolve(drData);
                }
            );
        });
    }


    private onElementFound(result: ResultElement) {
        if (!this.resultElementList[result.key]) {
            this.resultElementList[result.key] = [];
        }

        this.resultElementList[result.key].push(result.element);
    }


    private parseElements(): DrData {
        const stichdatum = this.getStichdatum();
        const drId = NovaDrParserMetadata.parseDatenreleaseId(this.resultElementList['metadata'][0]);
        console.log('DR id: ' + drId);

        console.log('parsing betreiber...');
        const betreiberMap = NovaDrParserBetreiber.parse(this.resultElementList['betreiber'], stichdatum);
        console.log('parsing betreiber completed (' + betreiberMap.size + ')');

        console.log('parsing verwaltungen...');
        const verwaltungMap = NovaDrParserVerwaltung.parse(this.resultElementList['verwaltung'], stichdatum, betreiberMap);
        console.log('parsing verwaltungen completed (' + verwaltungMap.size + ')');

        console.log('parsing haltestellen...');
        const hstMap = NovaDrParserHaltestelle.parse(this.resultElementList['hst'], stichdatum);
        console.log('parsing haltestellen completed (' + hstMap.size + ')');

        console.log('parsing kanten...');
        const kantenMap = NovaDrParserKante.parse(this.resultElementList['kante'], stichdatum, hstMap, verwaltungMap);
        console.log('parsing kanten completed (' + kantenMap.size + ')');

        console.log('parsing zonen...');
        const zonenMap = NovaDrParserZone.parse(this.resultElementList['zone'], stichdatum, kantenMap);
        console.log('parsing zonen completed (' + zonenMap.size + ')');

        console.log('parsing lokalnetze...');
        const lokalnetzMap = NovaDrParserLokalnetz.parse(this.resultElementList['lokalnetz'], stichdatum, kantenMap);
        console.log('parsing lokalnetze completed (' + lokalnetzMap.size + ')');

        console.log('parsing zonenpläne...');
        const zonenplanMap = NovaDrParserZonenplan.parse(this.resultElementList['zonenplan'], stichdatum, zonenMap, lokalnetzMap);
        console.log('parsing zonenpläne completed (' + zonenplanMap.size + ')');

        console.log('parsing interbereiche...');
        const interbereichMap = NovaDrParserInterbereich.parse(this.resultElementList['interbereich'], stichdatum, hstMap, kantenMap);
        console.log('parsing interbereiche completed (' + interbereichMap.size + ')');

        console.log('parsing relationsgebiete...');
        const relationsgebietMap = NovaDrParserRelationsgebiet.parse(this.resultElementList['relationsgebiet'], stichdatum);
        console.log('parsing relationsgebiete completed (' + relationsgebietMap.size + ')');

        console.log('parsing relationen...');
        NovaDrParserRelation.parse(this.resultElementList['relation'], stichdatum, hstMap, relationsgebietMap);
        console.log('parsing relationen completed');

        return new DrData(
            drId,
            hstMap,
            kantenMap,
            zonenMap,
            lokalnetzMap,
            zonenplanMap,
            interbereichMap,
            relationsgebietMap
        );
    }


    private getStichdatum(): string {
        const today = new Date();
        const month = today.getMonth() + 1;
        const monthStr = month >= 10 ? month.toString() : '0' + month.toString();
        const day = today.getDate();
        const dayStr = day >= 10 ? day.toString() : '0' + day.toString();

        return today.getFullYear() + '-' + monthStr + '-' + dayStr;
    }
}
