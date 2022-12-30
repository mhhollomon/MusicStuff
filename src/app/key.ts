import {capitalize} from './capitalize.lib';


export class Note {
    noteClass : string = 'A';
    alter : number = 0;

    constructor(note: string, alter? : number ) {

        if (alter) {
            if (![-2, -1, 0, 1, 2].includes(alter)) {
                throw Error("Invalid alter amount : " + alter);
            }
            this.alter = alter;
        }

        if (note.length == 2) {
            if (alter) {
                throw Error("Cannot use alter with accidental");
            }
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
        return this.noteClass + ['bb', 'b', '', '#', 'x'][this.alter+2];
    }

    noteDisplay() {
        return this.noteClass + ['\uD834\uDD2B', '\u266D', '', '\u266F', '\uD834\uDD2A'][this.alter+2];
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

export const ScaleTypeEnum = {
    minor : 'minor',
    major : 'major',
    phrygian : 'phrygian',
    augmented : 'augmented'
}

export type ScaleType = keyof typeof ScaleTypeEnum;

export class Scale {
    rootNote : Note;
    scaleType : ScaleType;
 

    constructor(rootNote : string | Note, scaleType : ScaleType ) {

        this.scaleType = scaleType;
        this.rootNote = (typeof rootNote == 'string') ? new Note(rootNote) : rootNote;

    }

    root() {
        return this.rootNote.note();
    }

    rootDisplay() {
        return this.rootNote.noteDisplay();
    }

    isMinor() {
        return (this.scaleType === ScaleTypeEnum.minor );
    }

    fullName() {
        return this.root() + ' ' + capitalize(this.scaleType);
    }

    fullDisplay() {
        return this.rootDisplay() + ' ' + capitalize(this.scaleType);
    }

    id() { return this.fullName(); }
}
