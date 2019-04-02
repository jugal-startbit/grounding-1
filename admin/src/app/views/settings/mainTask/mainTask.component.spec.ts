import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTaskComponent } from './mainTask.component';

describe('MainTaskComponent', () => {
  let component: MainTaskComponent;
  let fixture: ComponentFixture<MainTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
