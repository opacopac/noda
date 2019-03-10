import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {UploadDrComponent} from './components/upload-dr/upload-dr.component';
import {BaseMapComponent} from './components/base-map/base-map.component';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import { ConvertDrToJsonComponent } from './components/download-dr/convert-dr-to-json.component';


@NgModule({
    declarations: [
        AppComponent,
        UploadDrComponent,
        BaseMapComponent,
        NavBarComponent,
        ConvertDrToJsonComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
