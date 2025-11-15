import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionElergirnosComponent } from './section-elergirnos.component';

describe('SectionElergirnosComponent', () => {
  let component: SectionElergirnosComponent;
  let fixture: ComponentFixture<SectionElergirnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionElergirnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionElergirnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
