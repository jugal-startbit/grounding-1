import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmComponent } from './firm.component';

describe('FirmComponent', () => {
  let component: FirmComponent;
  let fixture: ComponentFixture<FirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
