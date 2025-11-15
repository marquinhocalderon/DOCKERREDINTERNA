import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisarusuariodelplanexpiradoComponent } from './avisarusuariodelplanexpirado.component';

describe('AvisarusuariodelplanexpiradoComponent', () => {
  let component: AvisarusuariodelplanexpiradoComponent;
  let fixture: ComponentFixture<AvisarusuariodelplanexpiradoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisarusuariodelplanexpiradoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvisarusuariodelplanexpiradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
