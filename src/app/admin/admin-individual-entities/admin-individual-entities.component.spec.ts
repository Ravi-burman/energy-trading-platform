import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIndividualEntitiesComponent } from './admin-individual-entities.component';

describe('AdminIndividualEntitiesComponent', () => {
  let component: AdminIndividualEntitiesComponent;
  let fixture: ComponentFixture<AdminIndividualEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminIndividualEntitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminIndividualEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
