export interface JsonSerializable<T> {
    toJSON(key: string): T;
}
