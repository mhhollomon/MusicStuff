import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Big18Component } from './big18.component';

describe('Big18Component', () => {
  let component: Big18Component;
  let fixture: ComponentFixture<Big18Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Big18Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Big18Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
