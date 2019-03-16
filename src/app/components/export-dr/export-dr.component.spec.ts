import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDrComponent } from './export-dr.component';

xdescribe('ExportDrComponent', () => {
  let component: ExportDrComponent;
  let fixture: ComponentFixture<ExportDrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportDrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
