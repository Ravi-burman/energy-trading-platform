import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModelWiseForecastComponent } from './admin-model-wise-forecast.component';

describe('AdminModelWiseForecastComponent', () => {
  let component: AdminModelWiseForecastComponent;
  let fixture: ComponentFixture<AdminModelWiseForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminModelWiseForecastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminModelWiseForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
