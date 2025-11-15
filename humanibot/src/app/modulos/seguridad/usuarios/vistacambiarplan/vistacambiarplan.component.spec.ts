import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistacambiarplanComponent } from './vistacambiarplan.component';

describe('VistacambiarplanComponent', () => {
  let component: VistacambiarplanComponent;
  let fixture: ComponentFixture<VistacambiarplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistacambiarplanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistacambiarplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
