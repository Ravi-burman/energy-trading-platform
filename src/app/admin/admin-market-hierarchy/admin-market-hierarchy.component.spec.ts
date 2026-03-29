import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMarketHierarchyComponent } from './admin-market-hierarchy.component';

describe('AdminMarketHierarchyComponent', () => {
  let component: AdminMarketHierarchyComponent;
  let fixture: ComponentFixture<AdminMarketHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMarketHierarchyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMarketHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
