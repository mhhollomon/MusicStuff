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
    total_weight  = 0.0;

    constructor(choices : Choice<T>[] ) {
        this.choices = choices;

        let accum = 0.0;
        for (const c of choices) {
            accum += c.weight;
            this.weights.push(accum);
        }

        this.total_weight = accum;
    
    }

    pick() : Choice<T> {

        /* This might be optimized out since
         * you can't see the results, but I hope
         * not. The PNG in javascript seems to be
         * very "streaky". Over the long run the 
         * distribution is flat. But in short runs
         * not so much.
         */
        const drop_count = Math.floor( ( Math.random() * 100.0 ) % 10 );
        for (let j = 0 ; j < drop_count; ++j ) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _x = Math.random();
        }

        const rnd_num = Math.random() * this.total_weight;
        
        let index = 0;
        for (const w of this.weights) {
            if (rnd_num <= w) {
                return this.choices[index];
            }
            index += 1;
        }

        /* Shouldn't get here. Only way this could happen is if somebody
         * messed with the fields of the object. Don't do that.
         */
    
        throw Error("Something went horribly wrong.");        
    }

    choose() : T {
        return this.pick().choice
    }
}


export function equalWeightedChooser<T>(choices : T[]) : Chooser<T> {
    return new Chooser(choices.map(v => mkch(v, 1)));
}

export function chooseFrom<T>(choices : Choice<T>[]) : T {
    return (new Chooser(choices)).choose();
}
