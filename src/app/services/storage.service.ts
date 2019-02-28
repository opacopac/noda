import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {DrData} from '../model/dr-data';
import {Observable, of} from 'rxjs';


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


    public storeDrData(drData: DrData) {
        return;

        /*const drDataString = this.serializeDrData(drData);

        console.log('storing ' + drDataString.length + ' bytes...');

        this.http
            .post(this.STORE_BASE_URL, { 'drdata': drDataString }, { observe: 'response' })
            .pipe(
                map(response => {
                    console.log('storing completed');
                    console.log(response);
                })
            ).subscribe();*/
    }


    public loadDrData(): Observable<DrData> {
        return of(undefined);

        /*return this.http
            .get(this.STORE_BASE_URL)
            .pipe(
                map(response => {
                    return this.deserializeDrData(response as string);
                })
            );*/
    }

    private serializeDrData(drData: DrData): string {
        return JSON.stringify({
            drId: drData.drId,
            haltestellen: Array.from(drData.haltestellen.entries()),
            kanten: Array.from(drData.kanten.entries()),
            zonen: Array.from(drData.zonen.entries()),
            lokalnetze: Array.from(drData.lokalnetze.entries()),
            zonenplaene: Array.from(drData.zonenplaene.entries()),
            relationsgebiete: Array.from(drData.relationsgebiete.entries())
        });
    }


    private deserializeDrData(drDataString: any): DrData {
        if (!drDataString) {
            return undefined;
        }

        // const drDataJson = JSON.parse(drDataString);
        const drDataJson = drDataString;
        return new DrData(
            drDataJson.drId,
            new Map(drDataJson.haltestellen),
            new Map(drDataJson.kanten),
            new Map(drDataJson.zonen),
            new Map(drDataJson.lokalnetze),
            new Map(drDataJson.zonenplaene),
            new Map(drDataJson.relationsgebiete)
        );
    }
}
