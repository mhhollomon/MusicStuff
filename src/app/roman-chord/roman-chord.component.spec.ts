import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RomanChordComponent } from './roman-chord.component';

describe('RomanChordComponent', () => {
  let component: RomanChordComponent;
  let fixture: ComponentFixture<RomanChordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RomanChordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RomanChordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
