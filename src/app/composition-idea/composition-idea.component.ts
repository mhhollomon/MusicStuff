import { Component } from '@angular/core';


function getRandomInt(min : number, max : number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function p(n : number) {
    return Math.random() * 100 < n;
}

interface Choice<Type> {
    choice : Type;
    weight : number;
}

function mkch<T>(c : T, w? : number) : Choice<T> {
    return { 'choice' : c, 'weight' : (w ? w : 1) };
}

/* Might be good to package these in an object so the weight
 * matrix can be precomputed
 */
function pickChoice<Type>(choices : Choice<Type>[]) {

    let weight_matrix : Array<number> = [];
    let accum = 0.0;
    for (let c of choices) {
        accum += c.weight;
        weight_matrix.push(accum);
    }

    let rnd_num = Math.random() * accum;
    let index = 0;
    for (let w of weight_matrix) {
        if (rnd_num < w) {
            return choices[index];
        }
        index += 1;
    }

    return choices[choices.length - 1];
}

const formChoices : Choice<string>[] = [ mkch('sentence'), mkch('period') ];

const speedChoices : Choice<string>[] = [
    mkch('slow', 42), mkch('medium', 16), mkch('fast', 42)
]

const timeSignatureChoices : Choice<string>[] = [
    mkch('4/4', 50), mkch('3/4', 35), mkch('6/8', 25)
]

const tonalityChoices : Choice<string>[] = [
    mkch('Major'), mkch('Minor')
]

const minorKeyChoices : Choice<string>[] = [
    mkch('A', 30), mkch('D', 17), mkch('G', 17), mkch('C', 17), mkch('E', 24), mkch('B', 10)
]

const majorKeyChoices : Choice<string>[] = [
    mkch('C', 30), mkch('F', 17), mkch('G', 17),
    mkch('D', 14), mkch('B\u266D', 11), mkch('A', 5),
    mkch('E\u266D', 5)
]

const noteChoices : Choice<string>[] = [
    mkch('1', 3), mkch('2', 1),
    mkch('3', 2), mkch('4', 1),
    mkch('5', 2), mkch('6', 1), mkch('7', 1)
]

@Component({
  selector: 'app-composition-idea',
  templateUrl: './composition-idea.component.html',
  styleUrls: ['./composition-idea.component.less']
})
export class CompositionIdeaComponent {

    show_idea : boolean = false;
    form_type : string = '';
    speed : string = '';
    time_sig : string = '';
    tonality : string = '';
    key_center  = '';
    note1 : string = '';
    note2 : string = '';

    generate() {
        
        this.form_type = pickChoice(formChoices).choice;
        this.speed = pickChoice(speedChoices).choice;
        this.time_sig = pickChoice(timeSignatureChoices).choice;
        this.tonality = pickChoice(tonalityChoices).choice;

        if (this.tonality == 'Minor') {
            this.key_center = pickChoice(minorKeyChoices).choice;
        } else {
            this.key_center = pickChoice(majorKeyChoices).choice;
        }

        this.note1 = pickChoice(noteChoices).choice;
        this.note2 = pickChoice(noteChoices).choice;

        /* do something */
        this.show_idea = true;
    }


}
