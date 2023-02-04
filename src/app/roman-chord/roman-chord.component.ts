import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-roman-chord',
  templateUrl: './roman-chord.component.html',
  styleUrls: ['./roman-chord.component.scss']
})
export class RomanChordComponent {

  @Input() main_text = 'I';
  @Input() super_text = '';
  @Input() sub_text = '';
}
