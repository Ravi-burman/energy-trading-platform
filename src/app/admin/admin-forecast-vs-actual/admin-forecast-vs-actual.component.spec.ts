import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminForecastVsActualComponent } from './admin-forecast-vs-actual.component';

describe('AdminForecastVsActualComponent', () => {
  let component: AdminForecastVsActualComponent;
  let fixture: ComponentFixture<AdminForecastVsActualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminForecastVsActualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminForecastVsActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
