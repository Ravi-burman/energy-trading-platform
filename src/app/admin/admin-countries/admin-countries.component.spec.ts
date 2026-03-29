import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCountriesComponent } from './admin-countries.component';

describe('AdminCountriesComponent', () => {
  let component: AdminCountriesComponent;
  let fixture: ComponentFixture<AdminCountriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCountriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
