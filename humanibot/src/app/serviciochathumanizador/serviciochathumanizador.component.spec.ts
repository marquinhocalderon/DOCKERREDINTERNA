import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciochathumanizadorComponent } from './serviciochathumanizador.component';

describe('ServiciochathumanizadorComponent', () => {
  let component: ServiciochathumanizadorComponent;
  let fixture: ComponentFixture<ServiciochathumanizadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciochathumanizadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciochathumanizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
