import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademiahumanibotComponent } from './academiahumanibot.component';

describe('AcademiahumanibotComponent', () => {
  let component: AcademiahumanibotComponent;
  let fixture: ComponentFixture<AcademiahumanibotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademiahumanibotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademiahumanibotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
