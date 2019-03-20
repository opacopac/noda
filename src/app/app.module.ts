import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {BaseMapComponent} from './components/base-map/base-map.component';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {LoadDrComponent} from './components/load-dr/load-dr.component';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatMenuModule,
    MatProgressBarModule, MatProgressSpinnerModule,
    MatRadioModule, MatSelectModule, MatSlideToggleModule,
    MatToolbarModule
} from '@angular/material';
import 'hammerjs';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        AppComponent,
        BaseMapComponent,
        NavBarComponent,
        LoadDrComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        // NoopAnimationsModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatMenuModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
