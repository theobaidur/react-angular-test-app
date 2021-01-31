import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilityPlanningComponent } from './disability-planning.component';

describe('DisabilityPlanningComponent', () => {
  let component: DisabilityPlanningComponent;
  let fixture: ComponentFixture<DisabilityPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisabilityPlanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
