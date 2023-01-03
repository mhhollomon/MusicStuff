import { Component } from '@angular/core';

import { Choice, Chooser, mkch } from '../chooser';
import { ScaleService } from '../scale.service';
import {capitalize} from '../capitalize.lib';

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
    styleUrls: ['./composition-idea.component.scss']
})
export class CompositionIdeaComponent {

    show_idea  = false;
    form_type  = '';
    speed  = '';
    time_sig  = '';
    tonality  = '';
    key_center  = '';
    note1  = '';
    note2  = '';

    constructor(private random_key_service : ScaleService) {

    }

    generate() {
        
        this.form_type = pickChoice(formChoices);
        this.speed = pickChoice(speedChoices);
        this.time_sig = pickChoice(timeSignatureChoices);

        const random_key = this.random_key_service.choose();

        this.tonality = capitalize(random_key.scaleType);
        this.key_center = random_key.rootDisplay();

        this.note1 = pickChoice(noteChoices);
        this.note2 = pickChoice(noteChoices);

        this.show_idea = true;
    }


}