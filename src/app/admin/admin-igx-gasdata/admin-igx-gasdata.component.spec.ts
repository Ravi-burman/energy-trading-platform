import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIgxGasdataComponent } from './admin-igx-gasdata.component';

describe('AdminIgxGasdataComponent', () => {
  let component: AdminIgxGasdataComponent;
  let fixture: ComponentFixture<AdminIgxGasdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminIgxGasdataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminIgxGasdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
