import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomChordsComponent } from './random-chords.component';

describe('RandomChordsComponent', () => {
  let component: RandomChordsComponent;
  let fixture: ComponentFixture<RandomChordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomChordsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomChordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
