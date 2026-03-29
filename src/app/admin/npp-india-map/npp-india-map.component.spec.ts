import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NppIndiaMapComponent } from './npp-india-map.component';

describe('NppIndiaMapComponent', () => {
  let component: NppIndiaMapComponent;
  let fixture: ComponentFixture<NppIndiaMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NppIndiaMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NppIndiaMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
