import { Component } from '@angular/core';

import { Choice, Chooser, mkch } from '../chooser';
import { RandomKeyService } from '../random-key.service';


function pickChoice<T>(choices : Choice<T>[]) : T {
    return (new Chooser(choices)).pick().choice;
}

const formChoices : Choice<string>[] = [ mkch('sentence'), mkch('period') ];

const speedChoices : Choice<string>[] = [
    mkch('slow', 42), mkch('medium', 16), mkch('fast', 42)
]

const timeSignatureChoices : Choice<string>[] = [
    mkch('4/4', 50), mkch('3/4', 35), mkch('6/8', 25)
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

    constructor(private random_key_service : RandomKeyService) {

    }

    capitalize(s : string) {
        return s.substring(0,1).toUpperCase() + s.substring(1).toLowerCase();
    }

    generate() {
        
        this.form_type = pickChoice(formChoices);
        this.speed = pickChoice(speedChoices);
        this.time_sig = pickChoice(timeSignatureChoices);

        let random_key = this.random_key_service.pick();

        this.tonality = this.capitalize(random_key.sonority);
        this.key_center = random_key.rootDisplay();

        this.note1 = pickChoice(noteChoices);
        this.note2 = pickChoice(noteChoices);

        this.show_idea = true;
    }


}
