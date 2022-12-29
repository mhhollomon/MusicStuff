export interface Choice<Type> {
    choice : Type;
    weight : number;
}

export function mkch<T>(c : T, w? : number) : Choice<T> {
    return { 'choice' : c, 'weight' : (w ? w : 1) };
}

export class Chooser<T> {

    choices : Choice<T>[] = [];
    weights : number[] = [];
    total_weight : number = 0.0;

    constructor(choices : Choice<T>[] ) {
        this.choices = choices;

        let accum = 0.0;
        for (let c of choices) {
            accum += c.weight;
            this.weights.push(accum);
        }

        this.total_weight = accum;
    
    }

    pick() : Choice<T> {
        let rnd_num = Math.random() * this.total_weight;
        
        let index = 0;
        for (let w of this.weights) {
            if (rnd_num < w) {
                return this.choices[index];
            }
            index += 1;
        }
    
        return this.choices[this.choices.length - 1];        
    }

    choose() : T {
        return this.pick().choice
    }
}


export function equalWeightedChooser<T>(choices : T[]) : Chooser<T> {
    return new Chooser(choices.map(v => mkch(v)));
}