import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMarketProviderComponent } from './admin-market-provider.component';

describe('AdminMarketProviderComponent', () => {
  let component: AdminMarketProviderComponent;
  let fixture: ComponentFixture<AdminMarketProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMarketProviderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMarketProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
