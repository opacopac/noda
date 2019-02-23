import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {UploadDrComponent} from './components/upload-dr/upload-dr.component';

@NgModule({
    declarations: [
        AppComponent,
        UploadDrComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
