import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlOverlayHaltestelleComponent } from './ol-overlay-haltestelle.component';

describe('OlOverlayHaltestelleComponent', () => {
  let component: OlOverlayHaltestelleComponent;
  let fixture: ComponentFixture<OlOverlayHaltestelleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlOverlayHaltestelleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlOverlayHaltestelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
