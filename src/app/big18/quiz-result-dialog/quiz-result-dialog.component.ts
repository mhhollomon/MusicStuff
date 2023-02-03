import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Results {
  count : number;
  timeBonus : number;
}

@Component({
  selector: 'app-quiz-result-dialog',
  templateUrl: './quiz-result-dialog.component.html',
  styleUrls: ['./quiz-result-dialog.component.scss']
})
export class QuizResultDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : Results
    ) {
  }
}
