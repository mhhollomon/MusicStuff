import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteFreqComponent } from './note-freq.component';

describe('NoteFreqComponent', () => {
  let component: NoteFreqComponent;
  let fixture: ComponentFixture<NoteFreqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteFreqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteFreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
