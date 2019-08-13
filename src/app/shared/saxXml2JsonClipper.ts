import {QualifiedAttribute, QualifiedTag, SAXParser, Tag} from 'sax';
import {ArrayHelper} from './arrayHelper';
import {Observable, Subject} from 'rxjs';


export interface TargetElement {
    key: string;
    elementPath: string[];
}


export interface ResultElement {
    key: string;
    elementPath: string[];
    element: any;
}


export class SaxXml2JsonClipper {
    private readonly CHUNK_SIZE_BYTES = 10 * 1024 * 1024;
    private readonly ATTRIBUTE_NAME_PREFIX = '@_';

    private readonly parser: SAXParser;
    private readonly currentPath: string[] = [];
    private readonly parentElementStack = [];
    private currentElement;
    private currentFileOffset = 0;
    private currentText: string;
    private elementStream: Subject<ResultElement>;


    public constructor(
        private readonly xmlFile: File,
        private readonly targetElements: TargetElement[]
    ) {
        this.parser = new SAXParser(true, { });
        this.parser.onopentag = this.onOpenTag.bind(this);
        this.parser.ontext = this.onText.bind(this);
        this.parser.onclosetag = this.onCloseTag.bind(this);
    }


    public parse(): Observable<ResultElement> {
        console.log('parsing xml file...');

        this.elementStream = new Subject<ResultElement>();

        window.setTimeout(() => {
                this.readChunk(this.currentFileOffset, this.CHUNK_SIZE_BYTES, this.xmlFile);
            }, 0
        );

        return this.elementStream.asObservable();
    }


    private readChunk(offset: number, length: number, file: File): void {
        const totChunkNum = Math.ceil(file.size / this.CHUNK_SIZE_BYTES);
        const currChunkNum = Math.ceil(offset / this.CHUNK_SIZE_BYTES) + 1;
        console.log('reading chunk ' + currChunkNum + '/' + totChunkNum + '...');
        const reader = new FileReader();
        const blob = file.slice(offset, offset + length);
        reader.onload = this.onReadChunkComplete.bind(this);
        reader.readAsText(blob);
    }


    private onReadChunkComplete(event): void {
        if (event.target.error !== null) {
            console.error('error reading xml file');
            console.error(event.target.error);

            return;
        }

        this.parser.write(event.target.result);
        this.currentFileOffset += event.loaded;

        if (this.currentFileOffset < this.xmlFile.size) {
            this.readChunk(this.currentFileOffset, this.CHUNK_SIZE_BYTES, this.xmlFile);
        } else {
            console.log('parsing xml file complete!');
            this.parser.close();
            this.elementStream.complete();
        }
    }


    private onOpenTag(tag: Tag | QualifiedTag): void {
        this.currentPath.push(tag.name);

        if (this.currentElement) {
            this.parentElementStack.push(this.currentElement);
            this.currentElement = this.createElement(tag);
        } else if (this.isAtATargetPath()) {
            this.currentElement = this.createElement(tag);
        }
    }


    private createElement(tag: Tag | QualifiedTag): any {
        const element = {};

        for (const [key, value] of Object.entries(tag.attributes)) {
            const jsonKey = this.ATTRIBUTE_NAME_PREFIX + key;
            if (value.value !== undefined) {
                element[jsonKey] = (value as QualifiedAttribute).value;
            } else {
                element[jsonKey] = value;
            }
        }

        return element;
    }


    private onText(text: string): void {
        this.currentText = text;
    }


    private onCloseTag(tagName: string): void {
        if (this.currentElement) {
            const parent = this.parentElementStack.length > 0 ? this.parentElementStack.pop() : undefined;

            if (parent) {
                if (this.hasChildren(this.currentElement)) {
                    this.setChildValue(parent, tagName, this.currentElement);
                } else {
                    this.setChildValue(parent, tagName, this.currentText);
                }
            } else {
                if (!this.hasChildren(this.currentElement)) {
                    this.setChildValue(this.currentElement, tagName, this.currentText);
                }

                this.elementStream.next({
                    key: this.getKeyByPath(this.currentPath),
                    elementPath: this.currentPath,
                    element: this.currentElement
                });
            }

            this.currentElement = parent;
        }

        this.currentPath.pop();
        this.currentText = undefined;
    }


    private hasChildren(element: any): boolean {
        return Object.entries(element).length > 0;
    }


    private setChildValue(element: any, tagName: string, newChildValue: any) {
        const oldChildValue = element[tagName];

        if (!oldChildValue) {
            element[tagName] = newChildValue;
        } else if (!Array.isArray(oldChildValue)) {
            element[tagName] = [oldChildValue, newChildValue];
        } else {
            element[tagName].push(newChildValue);
        }
    }


    private isAtATargetPath(): boolean {
        for (const targetPath of this.targetElements) {
            if (ArrayHelper.isEqualStringList(targetPath.elementPath, this.currentPath)) {
                return true;
            }
        }

        return false;
    }


    private getKeyByPath(path: string[]): string {
        for (let i = 0; i < this.targetElements.length; i++) {
            if (ArrayHelper.isEqualStringList(this.targetElements[i].elementPath, path)) {
                return this.targetElements[i].key;
            }
        }

        return undefined;
    }
}
