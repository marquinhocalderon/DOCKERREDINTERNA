import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuestrobotComponent } from './nuestrobot.component';

describe('NuestrobotComponent', () => {
  let component: NuestrobotComponent;
  let fixture: ComponentFixture<NuestrobotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuestrobotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuestrobotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
