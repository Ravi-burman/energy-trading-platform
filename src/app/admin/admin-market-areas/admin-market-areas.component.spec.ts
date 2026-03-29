import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMarketAreasComponent } from './admin-market-areas.component';

describe('AdminMarketAreasComponent', () => {
  let component: AdminMarketAreasComponent;
  let fixture: ComponentFixture<AdminMarketAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMarketAreasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMarketAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
