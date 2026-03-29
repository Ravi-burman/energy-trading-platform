import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorGroupingComponent } from './generator-grouping.component';

describe('GeneratorGroupingComponent', () => {
  let component: GeneratorGroupingComponent;
  let fixture: ComponentFixture<GeneratorGroupingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratorGroupingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratorGroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
