import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {UploadDrComponent} from './components/upload-dr/upload-dr.component';
import {BaseMapComponent} from './components/base-map/base-map.component';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {ExportDrComponent} from './components/export-dr/export-dr.component';
import {LoadDrComponent} from './components/load-dr/load-dr.component';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule, MatFormFieldModule, MatInputModule,
    MatProgressBarModule,
    MatRadioModule, MatSelectModule, MatSlideToggleModule,
    MatToolbarModule
} from '@angular/material';
import 'hammerjs';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        AppComponent,
        UploadDrComponent,
        BaseMapComponent,
        NavBarComponent,
        ExportDrComponent,
        LoadDrComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        // NoopAnimationsModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatProgressBarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
