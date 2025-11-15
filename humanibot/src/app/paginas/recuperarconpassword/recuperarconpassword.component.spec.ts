import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarconpasswordComponent } from './recuperarconpassword.component';

describe('RecuperarconpasswordComponent', () => {
  let component: RecuperarconpasswordComponent;
  let fixture: ComponentFixture<RecuperarconpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperarconpasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperarconpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
