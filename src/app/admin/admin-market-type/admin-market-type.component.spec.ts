import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMarketTypeComponent } from './admin-market-type.component';

describe('AdminMarketTypeComponent', () => {
  let component: AdminMarketTypeComponent;
  let fixture: ComponentFixture<AdminMarketTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMarketTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMarketTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
