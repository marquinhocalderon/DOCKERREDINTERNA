import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalpreciosComponent } from './modalprecios.component';

describe('ModalpreciosComponent', () => {
  let component: ModalpreciosComponent;
  let fixture: ComponentFixture<ModalpreciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalpreciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalpreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
