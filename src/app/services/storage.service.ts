import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {DrData} from '../model/dr-data';
import {Observable, of} from 'rxjs';
import {saveAs} from 'file-saver';


@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly STORE_BASE_URL = environment.restApiBaseUrl + 'drdatastore.php';


    constructor(private http: HttpClient) {
    }


    public downloadTextFile(url: string): Observable<string> {
        return this.http.get<string>(url, { responseType: 'text' as 'json'});
    }


    public exportStammdatenJson(drData: DrData, fileName: string) {
        const serDrData = this.serializeDrData(drData);
        const blob = new Blob([serDrData], {type: 'application/json;charset=utf-8'});
        saveAs(blob, fileName);
    }


    public exportJsonFile(jsonstring: string, fileName: string) {
        const blob = new Blob([jsonstring], {type: 'application/json;charset=utf-8'});
        saveAs(blob, fileName);
    }


    public serializeDrData(drData: DrData): string {
        return JSON.stringify(drData);
    }


    public deserializeDrData(drDataString: string): DrData {
        const drDataJson = JSON.parse(drDataString);
        return DrData.fromJSON(drDataJson);
    }
}
