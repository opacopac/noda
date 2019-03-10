import {JsonSerializable} from './json-serializable';


export interface StringMapJson<J> {
    map: StringMapEntryJson<J>[];
}


export interface StringMapEntryJson<J> {
    key: string;
    val: J;
}


export class StringMap<T extends JsonSerializable<J>, J> implements JsonSerializable<StringMapJson<J>> {
    private readonly map = new Map<string, T>();


    constructor() {
    }


    public get size(): number {
        return this.map.size;
    }


    public get(key: string): T {
        return this.map.get(key);
    }


    public set(key: string, value: T): void {
        this.map.set(key, value);
    }


    public has(key: string): boolean {
        return this.map.has(key);
    }


    public clear(): void {
        this.map.clear();
    }


    public delete(key: string): boolean {
        return this.map.delete(key);
    }


    public forEach(callbackfn: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any): void {
        this.map.forEach(callbackfn, thisArg);
    }


    public entries(): IterableIterator<[string, T]> {
        return this.map.entries();
    }


    public keys(): IterableIterator<string> {
        return this.map.keys();
    }


    public  values(): IterableIterator<T> {
        return this.map.values();
    }


    public toJSON(key: string): StringMapJson<J> {
        const entryList = Array.from(this.map.entries());

        return {
            map: entryList.map(entry => this.getEntryJson(entry))
        };
    }


    private getEntryJson(entry: [string, T]): StringMapEntryJson<J> {
        return {
            key: entry[0],
            val: entry[1].toJSON(undefined)
        };
    }
}
