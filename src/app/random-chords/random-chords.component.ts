import { Component, OnInit } from '@angular/core';

import { saveAs } from 'file-saver';
import  * as Midiwriter  from 'midi-writer-js'

import { HelpTextEmitterService } from '../help-text-emitter.service';
import {ScaleService } from '../scale.service';
import { RandomChordService, DuplicateControl } from '../random-chord.service';
import { Chord } from '../utils/music-theory/music-theory';
import { Note, Scale, ScaleType } from '../utils/music-theory/music-theory';
import { AudioService } from '../audio.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

const HELP_TEXT = `
<p>This page will let you generate a series of random chords</p>
<table>
<tr class="bg-light-gray"><td class="b">Mode</td></tr>
<tr><td>
    The mode sets how the generated chords are releated to each other and a  specified scale
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

<tr class="bg-light-gray"><td class="b">Chord Count</td></tr>
<tr><td>
  How many chords to generate.
  <p>By default the interface allows you to pick a particluar number of chords
    to generate. This number must be in the range of 1-6 inclusive if Duplicates = 'None' and 
    1-30 otherwise.</p>
  <p> The expander to the right allows you to open the interface so that You can choose range 
    of numbers and the actual number returned will be  in that range - inclusive.</p>
</td></tr>



<tr class="bg-light-gray"><td class="b">Chord Types</td></tr>
<tr>
  <td>
      Which chord types are allowed to be generated. At least one chord type must be allowed.
      <p>Underneath each checkbox is a slider which sets the relative weighting of that chord types.</p>
      <ul>
        <li><span class="b">Triads</span> - (default) Chords can be the "basic" triads (1,3,5)</li>
        <li><span class="b">Sus2</span> - The chord will cotain the second rather than third</li>
        <li><span class="b">Sus4</span> - The chord will cotain the fourth rather than third</li>
        <li><span class="b">7ths</span> - Chords may contain the 7th degree as well (1,3,5,7) - 7sus2 and 7sus4 is possible if those
            options are also chosen</li>
        </li>
      </ul>
      
  </td>
</tr>

<tr class="bg-light-gray"><td class="b">Extensions</td></tr>
<tr>
  <td>
      These are additional chord tones that can be added "on top" of the chord.
      <p>Underneath each checkbox is a slider which sets the probability that the associated extension
        will be added to the chord. Note that these are independent of each other. When the slider
        is far to the right, the extension is not very likeyl to be added. Conversely, when the slider
        is far to the left, the extension is very likely to be added.</p>      
  </td>
</tr>

<tr class="bg-light-gray"><td class="b">Inversions</td></tr>
<tr>
  <td>
      The chord will be inverted - the lowest note will something other than the root of the chord
      <p>Underneath each checkbox is a slider which sets the probability that the associated inversion
        will be generated.
        Note that these are independent of each other. When the slider
        is far to the right, the inversion is not very likey. Conversely, when the slider
        is far to the left, the inversion is very likely to be added.</p> 
      <p>At least one inversion must be allowed or an error will be generated</p>
      <p>The default weightings are the weightings that were used by the application before this change.</p>     
  </td>
</tr>

<tr class="bg-light-gray"><td class="b">Key (Diatonic Only)</td></tr>
<tr>
  <td>
    Control how the key used by the Diatonic Mode is chosen.
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

  min_chord_count = 3;
  max_chord_count = 5;
  count_range_mode = false;

  duplicates : DuplicateControl = 'none';
  mode  = 'Diatonic';
  scale_source  = "Random";

  allow_triads = true;
  triad_weight = 3;

  allow_sevenths = false;
  sevenths_weight = 3;

  allow_sus2 = false;
  sus2_weight = 3;

  allow_sus4 = false;
  sus4_weight = 3;

  allow_ninths = false;
  ninths_weight = 3;

  allow_elevenths = false;
  elevenths_weight = 3;

  allow_root_inv = true;
  root_inv_weight = 5;

  allow_first_inv = true;
  first_inv_weight = 3;

  allow_scnd_inv = true;
  scnd_inv_weight = 2;

  selected_sonority  = 'major';
  selected_key  = 'Random';
  

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

  range_mode_change() {
    this.count_range_mode = ! this.count_range_mode;

    if (this.count_range_mode) {
      if (this.min_chord_count > this.max_chord_count) {
        const temp = this.min_chord_count;
        this.min_chord_count = this.max_chord_count;
        this.max_chord_count = temp;
      }

    }
  }

  get chord_count_max() : number {
    if (this.duplicates !== 'none') {
      return 30;
    }

    return 6;
  }

  generate() {

    if (this.count_range_mode) {
      if (this.max_chord_count > this.chord_count_max || this.min_chord_count < 1) {
        return;
      }
    } else {
      if (this.min_chord_count > this.chord_count_max || this.min_chord_count < 1) {
        return;
      }

    }

    if (this.count_range_mode && this.min_chord_count > this.max_chord_count) {
      this.error_dialog.open(ErrorDialogComponent, {
        data: "min count must be less than or equal to max chord count",
      });

      return;

    }

    let picked_key : Scale | null = null;

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
      if (this.allow_sus2) builder.addChordType('sus2', this.sus2_weight);
      if (this.allow_sus4) builder.addChordType('sus4', this.sus4_weight);

      if (this.allow_sevenths) builder.addExtension('7th', this.sevenths_weight);
      if (this.allow_ninths) builder.addExtension('9th', this.ninths_weight);
      if (this.allow_elevenths) builder.addExtension('11th', this.elevenths_weight);

      if (this.allow_root_inv) builder.addInversion('root', this.root_inv_weight);
      if (this.allow_first_inv) builder.addInversion('first', this.first_inv_weight);
      if (this.allow_scnd_inv) builder.addInversion('second', this.scnd_inv_weight);

      builder.setCount(this.min_chord_count, this.count_range_mode ? this.max_chord_count : this.min_chord_count);

      builder.setDuplicate(this.duplicates)
          .setKey(picked_key);

      this.chords = builder.generate_chords();

      this.show_chords = true;
      /*
      for (const c in this.chords) {
        console.log(c, this.chords[c]);
      }
      */
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

  getKeyList() : string[] {
    return this.scaleService.getKeyList(this.selected_sonority as ScaleType);
  }

}
