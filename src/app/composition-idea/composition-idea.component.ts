import { Component, OnInit } from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';

import { Choice, Chooser, equalWeightedChooser, mkch } from '../chooser';
import { ScaleService } from '../scale.service';
import {capitalize} from '../capitalize.lib';

function pickChoice<T>(choices : Choice<T>[]) : T {
    return (new Chooser(choices)).pick().choice;
}

const promptData = [
    "Spacey",
    "Crunchy",
    "Piano",
    "Make some noisy noise. resample it. Get funky. Don't think, just do",
    "juxtaposition - take incongruous elements, toss them together",
    "Tonal percussion - Think water drops, tonal toms, maybe pick a sound and pitch it up and down. Build a pattern that utilizes the pitch of these elements to create a melodic pattern",
    "Interlude - It's not a drop, it's not a breakdown, it's not a build, it's an interlude.",
    "Whispering winds - sample and chop woodwinds or just the wind.",
    "Spaced out found sound rhythms. Use a traditional kick and snare if you want but build your groove out of snaps crackles and pops.",
    "Stacked harmony. Be it traditional vocals, vocoder, vocal pads…Pump them, chop them, slice them dice them.",
    "Long game dynamic changes. Make a transition that builds as slowly as possible… subtle moves that add up to a big emotional impact over time.",
    "Use an element that gently modulates in pitch.",
    ]

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
export class CompositionIdeaComponent implements OnInit {

    suggestionType = 'Orchestral';

    show_idea  = false;

    /* Orchestral Elements */
    form_type  = '';
    speed  = '';
    time_sig  = '';
    tonality  = '';
    key_center  = '';
    note1  = '';
    note2  = '';

    /* Electronic Elements */

    elchooser : Chooser<string>;

    prompts : string[] = [];

    constructor(private random_key_service : ScaleService, 
                private activeRoute: ActivatedRoute, private router : Router) {
        this.elchooser = equalWeightedChooser(promptData);
    }

    ngOnInit(): void {
        this.activeRoute.queryParams
            .subscribe(params => {
                const mode = capitalize(params['mode']);
                if (['Orchestral', 'Electronic'].includes(mode)) {
                    this.suggestionType = mode;
                }
            });
    }

    generate() {

        if (this.suggestionType === 'Orchestral') {
        
            this.form_type = pickChoice(formChoices);
            this.speed = pickChoice(speedChoices);
            this.time_sig = pickChoice(timeSignatureChoices);

            const random_key = this.random_key_service.choose();

            this.tonality = capitalize(random_key.scaleType);
            this.key_center = random_key.rootDisplay();

            this.note1 = pickChoice(noteChoices);
            this.note2 = pickChoice(noteChoices);
        } else {
            this.prompts = [];
            const prompt_count = equalWeightedChooser([2,3]).choose();
            while(this.prompts.length < prompt_count) {
                const new_choice = this.elchooser.choose();
                if (! this.prompts.includes(new_choice)) {
                    this.prompts.push(new_choice);
                }
            }
        }

        this.show_idea = true;
    }

    type_change() {
        this.show_idea = false;
        this.router.navigate( [], 
            {
              relativeTo: this.activeRoute,
              queryParams: {mode : this.suggestionType}, 
              queryParamsHandling: 'merge', // remove to replace all query params by provided
            }
        );
    }


}
