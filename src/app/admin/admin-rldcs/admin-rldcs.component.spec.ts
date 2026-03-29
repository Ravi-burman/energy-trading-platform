import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRldcsComponent } from './admin-rldcs.component';

describe('AdminRldcsComponent', () => {
  let component: AdminRldcsComponent;
  let fixture: ComponentFixture<AdminRldcsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRldcsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRldcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
