import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDrComponent } from './upload-dr.component';

describe('UploadDrComponent', () => {
  let component: UploadDrComponent;
  let fixture: ComponentFixture<UploadDrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
