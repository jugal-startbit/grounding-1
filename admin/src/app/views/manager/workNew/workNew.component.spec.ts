import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkNewComponent } from './workNew.component';

describe('WorkNewComponent', () => {
  let component: WorkNewComponent;
  let fixture: ComponentFixture<WorkNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
