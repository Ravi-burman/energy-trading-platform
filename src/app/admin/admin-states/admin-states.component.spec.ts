import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStatesComponent } from './admin-states.component';

describe('AdminStatesComponent', () => {
  let component: AdminStatesComponent;
  let fixture: ComponentFixture<AdminStatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminStatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
