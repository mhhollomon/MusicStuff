export class Note {
    noteClass : string = 'A';
    alter : number = 0;

    constructor(note: string) {
        if (note.length == 2) {
            this.test_and_set_note(note.substring(0, 1));
            let accidental = note.substring(1, 2);
            if (['#', 'b'].includes(accidental)) {
                this.alter = (accidental == '#') ? 1 : -1;
            } else {
                throw Error("Unknown accidental : " + accidental);
            }
        } else if (note.length == 1) {
            this.test_and_set_note(note);
        } else {
            throw Error("Invalid key specifier : " + note );
        }
    }

    note() {
        return this.noteClass + ['b', '', '#'][this.alter+1];
    }

    noteDisplay() {
        return this.noteClass + ['\u266D', '', '\u266F'][this.alter+1];
    }


    private test_and_set_note(note : string) {
        note = note.toUpperCase();

        if (['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(note)) {
            this.noteClass = note;
        } else {
            throw Error("Bad generic note :" + note);
        }
    }
}


export class Key {
    rootNote : Note;
    sonority : string;
 

    constructor(rootNote : string | Note, sonority : string ) {
        if ( ! ['minor', 'major'].includes(sonority)) {
            throw Error("unknown sonority : " + sonority);
        }

        this.sonority = sonority;
        this.rootNote = (typeof rootNote == 'string') ? new Note(rootNote) : rootNote;
    }

    root() {
        return this.rootNote.note();
    }

    rootDisplay() {
        return this.rootNote.noteDisplay();
    }

    isMinor() {
        return (this.sonority == 'minor');
    }
}
