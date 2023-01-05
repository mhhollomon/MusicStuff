import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { equalWeightedChooser } from '../chooser';


const scale_positions : { [index : string] : { key : string, name : string, pos : string[] } } = {
  'major-f1' : { key : 'major-f1', name : 'MAJOR F1', pos : ['p-1-1', 'p-3-1', 'p-5-1', 'p-1-2', 'p-3-2', 'p-5-2', 'p-2-3', 'p-3-3'] },
  'minor-f1' : { key : 'minor-f1', name : 'MINOR F1', pos : ['p-1-1', 'p-3-1', 'p-4-1', 'p-1-2', 'p-3-2', 'p-4-2', 'p-1-3', 'p-3-3'] },
}

@Component({
  selector: 'app-bass-scales',
  templateUrl: './bass-scales.component.html',
  styleUrls: ['./bass-scales.component.scss']
})
export class BassScalesComponent implements OnInit {

  all_scales = scale_positions;

  scaleName = 'Major';
  scalePositions = scale_positions['major-f1'].pos;
  scaleList = Object.keys(this.all_scales);


  constructor(private activeRoute: ActivatedRoute, private router : Router) {
  }

  ngOnInit(): void {
    this.activeRoute.queryParams
    .subscribe(params => {
        const sn = params['scale'];
        if (sn) {
          const scaleName = (sn as string).toLowerCase();
          if (scaleName in scale_positions) {
              this.scaleName = scaleName;
              this.scalePositions = scale_positions[scaleName].pos;
          }
        }
    });
  }

  scaleChange(newScale : string) {

    if (this.scaleList.includes(newScale)) {
      this.scaleName = newScale;
      this.scalePositions = this.all_scales[newScale].pos;

      this.router.navigate( [], 
        {
          relativeTo: this.activeRoute,
          queryParams: {scale : this.scaleName}, 
          queryParamsHandling: 'merge',
        }
      );
    }

  }

  buttonClasses(scale : string) {
    return (this.scaleName === scale ? ' activeNavButton' : 'navButton');
  }

  randomScale() {
    this.scaleChange(equalWeightedChooser(this.scaleList).choose());
  }
}
