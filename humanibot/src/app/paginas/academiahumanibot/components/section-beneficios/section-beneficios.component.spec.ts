import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionBeneficiosComponent } from './section-beneficios.component';

describe('SectionBeneficiosComponent', () => {
  let component: SectionBeneficiosComponent;
  let fixture: ComponentFixture<SectionBeneficiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionBeneficiosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionBeneficiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
