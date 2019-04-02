import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkExistingComponent } from './workExisting.component';

describe('WorkExistingComponent', () => {
  let component: WorkExistingComponent;
  let fixture: ComponentFixture<WorkExistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkExistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkExistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
