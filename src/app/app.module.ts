import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {UploadDrComponent} from './components/upload-dr/upload-dr.component';
import { BaseMapComponent } from './components/base-map/base-map.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

@NgModule({
    declarations: [
        AppComponent,
        UploadDrComponent,
        BaseMapComponent,
        NavBarComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
