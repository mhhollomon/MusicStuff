import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { interval, takeWhile } from 'rxjs';
import { shuffle } from '../utils/chooser';
import { QuizResultDialogComponent } from './quiz-result-dialog/quiz-result-dialog.component';

export interface GridData {
  empty : boolean;
  main : string;
  sup : string;
  sub : string;
  wrong? : boolean // only used after submit
}

const majorGrid : GridData[][] = [
  [ // Row 1
    { empty : false, main : 'I',   sup : '',  sub : ''  },
    { empty : false, main : 'ii',  sup : '4', sub : '2' },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
  ],
  [ // Row 2
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'ii',  sup : '7', sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'V',   sup : '4', sub : '3' },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'vii', sup : '\u2300'+'6', sub : '' },
  ],
  [ // Row 3
    { empty : false, main : 'I',   sup : '6', sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
  ],
  [ // Row 4
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'ii',  sup : '6', sub : '(5)'  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'IV',  sup : '',  sub : ''  },
    { empty : false, main : 'V',   sup : '4', sub : '2' },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
  ],
  [ // Row 5
    { empty : false, main : 'I',   sup : '6', sub : '4'  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'V',   sup : '(7)', sub : '' },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
  ],
  [ // Row 6
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'IV',  sup : '6', sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'vi',  sup : '', sub : ''   },
    { empty : true,  main : '',    sup : '',  sub : ''  },
  ],
  [ // Row 7
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'V',   sup : '6', sub : '5' },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
  ],

];

const minorGrid : GridData[][] = [

  [ // Row 1
    { empty : false, main : 'i',   sup : '',  sub : ''  },
    { empty : false, main : 'ii',  sup : '\u2300'+'4', sub : '2' },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
  ],
  [ // Row 2
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'ii',  sup : '\u2300'+'7', sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'V',   sup : '4', sub : '3' },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'vii', sup : '\u2300'+'6', sub : '' },
  ],
  [ // Row 3
    { empty : false, main : 'i',   sup : '6', sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
  ],
  [ // Row 4
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'ii',  sup : '\u2300'+'6', sub : '(5)'  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'iv',  sup : '',  sub : ''  },
    { empty : false, main : 'V',   sup : '4', sub : '2' },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
  ],
  [ // Row 5
    { empty : false, main : 'i',   sup : '6', sub : '4'  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'V',   sup : '(7)', sub : '' },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
  ],
  [ // Row 6
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'iv',  sup : '6', sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'VI',  sup : '', sub : ''   },
    { empty : true,  main : '',    sup : '',  sub : ''  },
  ],
  [ // Row 7
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : false, main : 'V',   sup : '6', sub : '5' },
    { empty : true,  main : '',    sup : '',  sub : ''  },
    { empty : true,  main : '',    sup : '',  sub : ''  },
  ],

];

const majorDiscards : GridData[] = [
  { empty : false, main : 'I',  sup : '7', sub : ''   },
  { empty : false, main : 'iii',  sup : '', sub : ''   },
  { empty : false, main : 'IV',  sup : '6', sub : '4'   },
  { empty : false, main : 'vi',  sup : '6', sub : ''   },

]

const minorDiscards : GridData[] = [
  { empty : false, main : 'i',  sup : '7', sub : ''   },
  { empty : false, main : 'III',  sup : '', sub : ''   },
  { empty : false, main : 'iv',  sup : '6', sub : '4'   },
  { empty : false, main : 'VI',  sup : '6', sub : ''   },

]


function makeBlankData(empty : boolean = true ) : GridData {
  return { empty : empty, main : '',  sup : '',  sub : '' }
}

const majorHeaders = [
  'I', 'ii', 'iii', 'IV', 'V', 'vi', '<div>vii<sup>\u2300</sup></div>'
]

const minorHeaders = [
  'i', '<div>ii<sup>\u2300</sup></div>', 'III', 'iv', 'V', 'VI', '<div>vii<sup>\u2300</sup></div>'
]

type ScreenModeType = 'study' | 'quiz';
type QuizModeType = 'easy' | 'hard' | 'harder';

interface dndData {
  area : string;
  from : number[];
  data : GridData;
}



@Component({
  selector: 'app-big18',
  templateUrl: './big18.component.html',
  styleUrls: ['./big18.component.scss']
})
export class Big18Component {


  currentGridData : GridData[][] = majorGrid;
  currentHeaders : string[] = majorHeaders;
  drawPile : GridData[] = [];
  discardPile : GridData[] = [];


  inMajor = true;
  screenMode : ScreenModeType = 'study';
  quizMode : QuizModeType = 'easy';

  timerRunning = false;
  timeRemaining = 60;

  get colorEmpty() { return this.screenMode === 'study' || this.quizMode === 'easy'; }

  get drawTop() : GridData {
    if (this.drawPile.length > 0) {
      return this.drawPile[0];
    } else {
      return makeBlankData(true);

    }
  }

  get discardTop() : GridData {
    if (this.discardPile.length > 0) {
      return this.discardPile[0];
    } else {
      return makeBlankData(true);

    }
  }


  @ViewChild("mainContainer") mainContainer! : ElementRef;
  @ViewChild("sidePanel") sidePanel! : ElementRef;

  get tonalityValue() { return this.inMajor ? 'true' : 'false'; }

  constructor(
    public dialog: MatDialog, 
    ) {}

  displayTonality() {
    if (this.inMajor) {
      this.currentGridData = majorGrid;
      this.currentHeaders  = majorHeaders;
    } else {
      this.currentGridData = minorGrid;
      this.currentHeaders  = minorHeaders;
    }
  }

  switchTonality(event : string) {
    this.inMajor = event === 'true';

    this.displayTonality();
    if (this.screenMode === 'quiz') {
      this.resetQuiz();
    }


  }

  switchMode(event : MatButtonToggleChange) {
    this.screenMode = event.value;

    if (this.screenMode === 'quiz') {
      this.sidePanel.nativeElement.style.display = 'grid';
      setTimeout(() => {
        this.mainContainer.nativeElement.classList.add('quiz-mode');
      }, 20);

      this.resetQuiz();

    } else {
      this.mainContainer.nativeElement.classList.remove('quiz-mode');
      setTimeout(() => {
        this.sidePanel.nativeElement.style.display = 'none';
      }, 2010);

      this.displayTonality();

    }
  }

  switchDifficulty(event : MatButtonToggleChange) {
    this.quizMode = event.value;

    this.resetQuiz();
  }

  resetQuiz() {

    this.timerRunning = false;
    this.timeRemaining = 60;
    this.drawPile = [];
    this.discardPile = [];

    const quizGrid : GridData[][] = [
      [],[],[],[],[],[],[]
    ]

    const exemplar = (this.inMajor ? majorGrid : minorGrid)

    for (let row = 0; row < 7; ++row) {
      for (let col = 0; col < 7; ++col) {
        const thisOne = exemplar[row][col];
        if (thisOne.empty) {
          quizGrid[row].push({ ...thisOne });
        } else {
          this.drawPile.push({...thisOne});
          quizGrid[row].push(makeBlankData(false));
        }

      }
    }

    this.drawPile.push(...(this.inMajor ? majorDiscards : minorDiscards));

    this.drawPile = shuffle(this.drawPile);

    this.currentGridData = quizGrid;
  }

  private get exemplar() { return (this.inMajor ? majorGrid : minorGrid) }
  private matches(a : GridData, b : GridData) : boolean {
    return a === b || (
      a.empty === b.empty &&
      a.main === b.main &&
      a.sub === b.sub &&
      a.sup === b.sup
    );
  }

  dropOnGrid(event : any, target : dndData) {
    console.log("drop", event);
    console.log("target", target);

    const source = event.data as dndData;

    if (target.area === 'grid') {
      this.sendToGrid(source, target);
    } else if (target.area === 'draw') {
      this.sendToDraw(source, target);
    } else if (target.area === 'discard') {
      this.sendToDiscard(source, target);
    }
  }

  sendToGrid(source : dndData, target : dndData) {


    if (this.quizMode === 'harder' || this.matches(this.exemplar[target.from[0]][target.from[1]], source.data )) {
      this.currentGridData[target.from[0]][target.from[1]] = source.data;

      if (source.area === 'draw') {
        this.drawPile.shift();
      } else if (source.area === 'discard') {
        this.discardPile.shift();
      } else if (source.area === 'grid' ) {
        const empty = this.exemplar[source.from[0]][source.from[1]].empty;
        this.currentGridData[source.from[0]][source.from[1]] = makeBlankData(empty);
      }
  
      if (target.data.main !== '' ) {
        // We are replacing data 
        if (source.area === 'draw' || source.area ==='discard') {
          this.drawPile.unshift(target.data);
        } else if (source.area === 'grid' ) {
          this.currentGridData[source.from[0]][source.from[1]] = target.data;
        }
      }
  
    }


  }

  sendToDraw(source : dndData, target : dndData) {
    // Dropped over the starting position.
    if (source.area === 'draw') return;

    this.drawPile.unshift(source.data);

    if (source.area === 'discard') {
      this.discardPile.shift();
    } else if (source.area === 'grid') {
      const empty = this.exemplar[source.from[0]][source.from[1]].empty;
      this.currentGridData[source.from[0]][source.from[1]] = makeBlankData(empty);
    }
  }

  sendToDiscard(source : dndData, target : dndData) {
    // Dropped over the starting position.
    if (source.area === 'discard') return;

    this.discardPile.unshift(source.data);

    if (source.area === 'draw') {
      this.drawPile.shift();
    } else if (source.area === 'grid') {
      const empty = this.exemplar[source.from[0]][source.from[1]].empty;
      this.currentGridData[source.from[0]][source.from[1]] = makeBlankData(empty);
    }
  }

  clickReset() {
    this.resetQuiz();
  }

  clickSubmit() {

    this.timerRunning = false;

    let count = 0;

    for (let r = 0; r < 7; ++r) {
      for (let c = 0; c < 7; ++c ){

        const match = this.matches(
          this.currentGridData[r][c], this.exemplar[r][c]
        );

        this.currentGridData[r][c].wrong = ! match;

        if (!this.exemplar[r][c].empty && match ) {
          count += 1;
        }
      }
    }

    let timeBonus = 0;
    if (count === 14) {
      timeBonus = this.timeRemaining;
    }

    this.dialog.open(QuizResultDialogComponent, { data : {
      count : count,
      timeBonus : timeBonus,
    }})

  }

  clickStart() {
    this.resetQuiz();
    this.timerRunning = true;
    this.timeRemaining = 60;

    interval(1000).pipe(takeWhile(_ => this.timerRunning)).subscribe( _ => {
      this.timeRemaining -= 1;
      this.timerRunning = (this.timeRemaining > 0);

      if (!this.timerRunning) {
        this.clickSubmit();
      }
    })

  }




}
