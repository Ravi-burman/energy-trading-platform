import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRtm192Component } from './admin-rtm192.component';

describe('AdminRtm192Component', () => {
  let component: AdminRtm192Component;
  let fixture: ComponentFixture<AdminRtm192Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRtm192Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRtm192Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
