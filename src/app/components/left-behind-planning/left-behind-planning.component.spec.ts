import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftBehindPlanningComponent } from './left-behind-planning.component';

describe('LeftBehindPlanningComponent', () => {
  let component: LeftBehindPlanningComponent;
  let fixture: ComponentFixture<LeftBehindPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftBehindPlanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftBehindPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
