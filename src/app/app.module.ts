import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {MapComponent} from './components/map/map.component';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {MenuComponent} from './components/menu/menu.component';
import {
    MatAutocompleteModule,
    MatButtonModule, MatCardModule,
    MatCheckboxModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatMenuModule,
    MatProgressBarModule, MatProgressSpinnerModule,
    MatRadioModule, MatSelectModule, MatSlideToggleModule,
    MatToolbarModule
} from '@angular/material';
import 'hammerjs';
import {ReactiveFormsModule} from '@angular/forms';
import { OlOverlayHaltestelleComponent } from './components/ol-overlay-haltestelle/ol-overlay-haltestelle.component';
import { OlOverlayKanteComponent } from './components/ol-overlay-kante/ol-overlay-kante.component';


@NgModule({
    declarations: [
        AppComponent,
        MapComponent,
        NavBarComponent,
        MenuComponent,
        OlOverlayHaltestelleComponent,
        OlOverlayKanteComponent
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
        MatCardModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
