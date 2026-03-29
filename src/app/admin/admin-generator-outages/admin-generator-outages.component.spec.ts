import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGeneratorOutagesComponent } from './admin-generator-outages.component';

describe('AdminGeneratorOutagesComponent', () => {
  let component: AdminGeneratorOutagesComponent;
  let fixture: ComponentFixture<AdminGeneratorOutagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGeneratorOutagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGeneratorOutagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
