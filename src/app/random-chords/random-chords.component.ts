import { Component, OnInit } from '@angular/core';

import { saveAs } from 'file-saver';
import  * as Midiwriter  from 'midi-writer-js'

import { HelpTextEmitterService } from '../help-text-emitter.service';
import {ScaleService } from '../scale.service';
import { RandomChordService, DuplicateControl } from '../random-chord.service';
import { Chord, ChordType, } from '../utils/music-theory/music-theory';
import { Note, Scale, ScaleType } from '../utils/music-theory/music-theory';
import { AudioService } from '../audio.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

const HELP_TEXT = `
<p>This page will let you generate a series of random chords</p>
<table>
<tr class="bg-light-gray"><td class="b">Mode</td></tr>
<tr><td>
    <p>The mode sets how the generated chords are releated to each other and a  specified scale</p>
    <ul>
      <li><span class="b">Diatonic</span> - (default) The chords generate will be "in" a key. The root note for
          each chord will be taken from the given scale. The quality will be set according to the scale.
          In particular that means that there can be at most 7 unique chords.
          <p>The key itself may be random or selected by the user (see below). <p>
      </li>
      <li><span class="b">Chromatic</span> - The chords are not related to each other. The root note
          of each chord is selected at random from the keyboard. A quality (major, minor, augmented, diminished)
          is choosen separately.
    </ul>
</td></tr>

<tr class="bg-light-gray"><td class="b">Chord Count</td></tr>
<tr><td>
  <p>How many chords to generate. The allowable range depends on how duplicates are handled.</p>
</td></tr>

<tr class="bg-light-gray"><td class="b">Duplicates</td></tr>
<tr>
  <td>What duplicates are allowed. A chord is considered a "duplicate" if it has the same root note. 
      Quality (maj, min, etc), type (triad, 7th, etc), and inversion are not considered.
      <ul>
        <li><span class="b">None</span> - (default) No duplicates are allowed.</li>
        <li><span class="b">Not Adjacent</span> - Duplicates are allowed as long as they are not next to each other in the set of chords</li>
        <li><span class="b">Any</span> - All duplicates are allowed</li>
      </ul>
      
  </td>
</tr>


<tr class="bg-light-gray"><td class="b">Chord Types</td></tr>
<tr>
  <td>
      Which chord types are allowed to be generated. At least one chord type must be allowed.
      <p>Underneath each checkbox is a slider which sets the relative wieghting of that chord types.</p>
      <ul>
        <li><span class="b">Triads</span> - (default) Chords can be the "basic" triads (1,3,5)</li>
        <li><span class="b">7ths</span> - Chords may contain the 7th degree as well (1,3,5,7)</li>
        <li><span class="b">9ths</span> - Chords may contain the 9th degree. Note that both "pure" 9ths (1,3,5,7,9) as well
                    as "add 9" (1,3,5,9) are generated with equal weighting.
        </li>
      </ul>
      
  </td>
</tr>

<tr class="bg-light-gray"><td class="b">Key (Diatonic Only)</td></tr>
<tr>
  <td>
    <p>Control how the key used by the Diatonic Mode is chosen.
      <ul>
        <li><span class="b">Random</span> - (default) Let the computer decide</li>
        <li><span class="b">Selected</span> - The user selects. If chosen, another set of boxes will appear allowing you to choose
              the tonality (major, minor, dorian, etc) and the key center (or leave the key center random).</li>
      </ul>
      
  </td>
</tr>
</table>
`;
const HELP_PAGE_NAME = "Random Chords";

const octavePlacement : { [ index : string ] : number } = {
  'C' : 0, 'D' : 1, 'E' : 2, 'F' : 3, 'G' : 4, 'A' : 5, 'B' : 6 
}

@Component({
  selector: 'app-random-chords',
  templateUrl: './random-chords.component.html',
  styleUrls: ['./random-chords.component.scss']
})
export class RandomChordsComponent implements OnInit {

  key : Scale = new Scale('C', 'major');

  chords : Chord[] = [];

  show_chords = false;
  show_key = true;
  show_scale = false;
  show_chord_tones = true;
  scale_disabled = false;
  scale_notes : Note[] = [];

  new_chord_tones = true;

  // Model elements
  chord_count = 4;
  duplicates : DuplicateControl = 'none';
  mode  = 'Diatonic';
  scale_source  = "Random";

  allow_triads = true;
  triad_weight = 3;

  allow_sevenths = false;
  sevenths_weight = 3;

  allow_ninths = false;
  ninths_weight = 3;


  selected_sonority  = 'major';
  selected_key  = 'Random';

  minorkeys = this.scaleService.getMinorKeyList();
  majorkeys = this.scaleService.getMajorKeyList();
  

  constructor(private scaleService : ScaleService,
    private randomChordService : RandomChordService,
    private audioService : AudioService,
    public error_dialog: MatDialog, 

    private help_text : HelpTextEmitterService) {

  }

  ngOnInit(): void {
    this.help_text.setHelp({ help_text : HELP_TEXT, page_name : HELP_PAGE_NAME });
  }


  getPanelTitle() : string {

    let retval = this.mode;
    
    if (this.mode === 'Diatonic' && this.show_chords) {
        retval = this.key.fullDisplay();    
    }

    return retval;
  }

  stopPropagation(evnt : Event) {
    evnt.stopPropagation();
  }

  chord_tone_change(evnt : Event) {

    this.stopPropagation(evnt);

    this.show_chord_tones = ! this.show_chord_tones;
  }

  get chord_count_max() : number {
    if (this.duplicates !== 'none') {
      return 30;
    }

    return 6;
  }

  generate() {

    if (this.chord_count > this.chord_count_max || this.chord_count < 1) {
      return;
    }

    let picked_key : Scale | null = null;

    const chordTypes : ChordType[] = [];
    if (this.allow_triads) { chordTypes.push('triad'); }
    if (this.allow_sevenths) { chordTypes.push('7th'); }
    if (this.allow_ninths) { chordTypes.push('9th'); }

    if (this.mode === 'Diatonic') {

      if (this.scale_source === "Selected") {
        if (this.selected_key === 'Random') {
          this.key = this.scaleService.choose(this.selected_sonority as ScaleType);
        } else {
          this.key = new Scale(this.selected_key, this.selected_sonority as ScaleType);
        }
        } else {
          this.key = this.scaleService.choose();
        }
      this.scale_notes = this.scaleService.getScaleNotes(this.key);
      picked_key = this.key;
      this.show_key = true;

    } else {

      // -- Chromatic Mode
      this.show_key = false;
      this.scale_notes = [];
      
    }

    try {
      const builder = this.randomChordService.builder();

      if (this.allow_triads) builder.addChordType('triad', this.triad_weight);
      if (this.allow_sevenths) builder.addChordType('7th', this.sevenths_weight);
      if (this.allow_ninths) builder.addChordType('9th', this.ninths_weight);

      builder.setCount(this.chord_count)
          .setDuplicate(this.duplicates)
          .setKey(picked_key);

      this.chords = builder.generate_chords();

      this.show_chords = true;
    } catch(e) {
      let error_msg = 'oopsy - unknown error';
      if (typeof e === "string") {
        error_msg = e;
      } else if (e instanceof Error) {
          error_msg = e.message;
          if (e.stack) {
            error_msg += "\n" + e.stack;
          }

        this.error_dialog.open(ErrorDialogComponent, {
          data: error_msg,
        });

      }
    }

  }

  async play_chord(chord : Chord) {

    const tones : string[] = [];
    let octave = 3;
    let last  = -1;
    let isBassNote = true;

    for (const c of chord.invertedChordTones()) {

      const simpleNote = c.toSharp();

      if (octavePlacement[simpleNote.noteClass] < last) {
        octave += 1;
      }
      tones.push(simpleNote.note() + octave);
      if (isBassNote) {
        octave += 1;
        isBassNote = false;
      } else {
        last = octavePlacement[simpleNote.noteClass];
      }

    }
  
    this.audioService.play_chord(tones);

  }

  generate_midi(evnt : Event) {

    this.stopPropagation(evnt);

    const track = new Midiwriter.Track();

    if (!this.show_chords || this.chords.length < 1) return;

    for (const c of this.chords) {

      // Want to place the bass note "down an octave"
      let octave = 3;
      let last  = -1;
      let isBassNote = true;
  
      const options : Midiwriter.Options = {sequential: false, duration : '1', pitch : []}

      for (const n of c.invertedChordTones()) {

        const simpleNote = n.toSharp();
        if (octavePlacement[simpleNote.noteClass] < last) {
          octave += 1;
        }
        (options.pitch as unknown as string[]).push(simpleNote.note() + octave );
        if (isBassNote) {
          octave += 1;
          isBassNote = false;
        } else {
          last = octavePlacement[simpleNote.noteClass];
        }
  
      }

      track.addEvent(new Midiwriter.NoteEvent(options))
    }

    if (this.mode === 'Diatonic' ) {

      let octave = ['G', 'A', 'B'].includes(this.scale_notes[0].toSharp().noteClass) ? 3 : 4;
      let last  = -1;
      const scale_options : Midiwriter.Options = {sequential: true, duration : '4', pitch : []}
      for (const n of this.scale_notes) {

        const simpleNote = n.toSharp();


        if (octavePlacement[simpleNote.noteClass] < last) {
          octave += 1;
        }
        (scale_options.pitch as unknown as string[]).push(simpleNote.note() + octave );
        last = octavePlacement[simpleNote.noteClass];
      }

      track.addEvent(new Midiwriter.NoteEvent(scale_options))

    }


    const midi_writer = new Midiwriter.Writer(track);

    const  blob = new Blob([midi_writer.buildFile()], {type: "audio/midi"});
    saveAs(blob, "random-chords.mid");

  }

  mode_change() {
    this.show_chords = false;
    this.chords = [];
    if (this.mode == "Diatonic" ) {
      this.show_key = true;
      this.scale_disabled = false;
    } else {
      this.show_key = false;
      this.scale_disabled = true;
    }
  }

}
