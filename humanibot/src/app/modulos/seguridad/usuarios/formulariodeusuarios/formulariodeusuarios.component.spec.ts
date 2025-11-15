import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulariodeusuariosComponent } from './formulariodeusuarios.component';

describe('FormulariodeusuariosComponent', () => {
  let component: FormulariodeusuariosComponent;
  let fixture: ComponentFixture<FormulariodeusuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulariodeusuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulariodeusuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
