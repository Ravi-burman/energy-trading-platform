import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIndiaTendsComponent } from './admin-india-tends.component';

describe('AdminIndiaTendsComponent', () => {
  let component: AdminIndiaTendsComponent;
  let fixture: ComponentFixture<AdminIndiaTendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminIndiaTendsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminIndiaTendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
