import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatGridListModule} from '@angular/material/grid-list';

import { RandomChordsComponent } from './random-chords.component';
import { AudioService } from '../audio.service';

describe('RandomChordsComponent', () => {
  let component: RandomChordsComponent;
  let fixture: ComponentFixture<RandomChordsComponent>;

  let audioServiceSpy : jasmine.SpyObj<AudioService>;

  beforeEach(async () => {
    audioServiceSpy = jasmine.createSpyObj('MockAudioService', ['play_chord'])
    await TestBed.configureTestingModule({
      imports : [
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatExpansionModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatRadioModule,
        MatGridListModule,
        NoopAnimationsModule,
      ],
      declarations: [ RandomChordsComponent ],
      providers: [{provide : AudioService, useValue : audioServiceSpy }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomChordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should generate chords when button is clicked", fakeAsync(() => {
    const topElement: HTMLElement = fixture.nativeElement;
    const genButton  = topElement.querySelector('#generate_chords_buton');

    expect(genButton).toBeTruthy();
    (genButton as HTMLElement).click();

    tick();

    expect(component.chord_count).toBeGreaterThan(0);
  }));
});