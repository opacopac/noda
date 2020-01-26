import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {MapComponent} from './components/map/map.component';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {MenuComponent} from './components/menu/menu.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
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
        MatIconModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
