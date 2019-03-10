import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertDrToJsonComponent } from './convert-dr-to-json.component';

xdescribe('ConvertDrToJsonComponent', () => {
  let component: ConvertDrToJsonComponent;
  let fixture: ComponentFixture<ConvertDrToJsonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertDrToJsonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertDrToJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
