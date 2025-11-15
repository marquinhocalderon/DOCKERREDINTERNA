import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortadaprincipalComponent } from './portadaprincipal.component';

describe('PortadaprincipalComponent', () => {
  let component: PortadaprincipalComponent;
  let fixture: ComponentFixture<PortadaprincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortadaprincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortadaprincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
