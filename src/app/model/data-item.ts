import {DataItemType} from './data-item-type';


export interface DataItem {
    getType(): DataItemType;
}
