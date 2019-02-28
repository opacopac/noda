import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDrComponent } from './download-dr.component';

describe('DownloadDrComponent', () => {
  let component: DownloadDrComponent;
  let fixture: ComponentFixture<DownloadDrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadDrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadDrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
