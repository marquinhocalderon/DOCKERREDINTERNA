import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciossolutionsComponent } from './serviciossolutions.component';

describe('ServiciossolutionsComponent', () => {
  let component: ServiciossolutionsComponent;
  let fixture: ComponentFixture<ServiciossolutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciossolutionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciossolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
