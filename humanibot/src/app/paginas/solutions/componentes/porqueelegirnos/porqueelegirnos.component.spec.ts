import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorqueelegirnosComponent } from './porqueelegirnos.component';

describe('PorqueelegirnosComponent', () => {
  let component: PorqueelegirnosComponent;
  let fixture: ComponentFixture<PorqueelegirnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PorqueelegirnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PorqueelegirnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
