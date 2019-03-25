import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlOverlayKanteComponent } from './ol-overlay-kante.component';

describe('OlOverlayKanteComponent', () => {
  let component: OlOverlayKanteComponent;
  let fixture: ComponentFixture<OlOverlayKanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlOverlayKanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlOverlayKanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
