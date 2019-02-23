import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {UploadDrComponent} from './components/upload-dr/upload-dr.component';
import { BaseMapComponent } from './components/base-map/base-map.component';

@NgModule({
    declarations: [
        AppComponent,
        UploadDrComponent,
        BaseMapComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
