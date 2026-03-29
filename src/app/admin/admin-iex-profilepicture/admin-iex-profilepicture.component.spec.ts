import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIexProfilepictureComponent } from './admin-iex-profilepicture.component';

describe('AdminIexProfilepictureComponent', () => {
  let component: AdminIexProfilepictureComponent;
  let fixture: ComponentFixture<AdminIexProfilepictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminIexProfilepictureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminIexProfilepictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
