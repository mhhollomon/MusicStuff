import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClefsComponent } from './clefs.component';

describe('ClefsComponent', () => {
  let component: ClefsComponent;
  let fixture: ComponentFixture<ClefsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClefsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClefsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
