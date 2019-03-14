import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDrComponent } from './load-dr.component';

describe('LoadDrComponent', () => {
  let component: LoadDrComponent;
  let fixture: ComponentFixture<LoadDrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadDrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadDrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
