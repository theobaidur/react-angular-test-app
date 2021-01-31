import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionPlanningComponent } from './pension-planning.component';

describe('PensionPlanningComponent', () => {
  let component: PensionPlanningComponent;
  let fixture: ComponentFixture<PensionPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionPlanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
