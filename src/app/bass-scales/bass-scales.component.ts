import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { equalWeightedChooser } from '../utils/chooser';
import { HelpTextEmitterService } from '../help-text-emitter.service';

const HELP_TEXT = "This page will show you fingerings for various scales on a 4 string bass guitar";
const HELP_PAGE_NAME = "Bass Scales";


interface fingering {
  p : string,
  f : number
}

function mkfg(p: string, f : number) : fingering {
 return { p : p, f : f };
}

const scale_positions : { [index : string] : { key : string, name : string, pos : fingering[] } } = {
  'blues' : { key : 'blues', name : 'Blues', 
              pos : [ mkfg('p-1-1', 1), mkfg('p-4-1', 4),
                      mkfg('p-1-2', 1), mkfg('p-2-2', 2), mkfg('p-3-2', 3), 
                      mkfg('p-1-3', 1), mkfg('p-3-3', 3), mkfg('p-4-3', 4),
                     ] },

  'major-f1' : { key : 'major-f1', name : 'Major F1', 
                pos : [mkfg('p-1-1', 1), mkfg('p-3-1', 3), mkfg('p-5-1', 4),
                      mkfg('p-1-2', 1), mkfg('p-3-2', 3), mkfg('p-5-2', 4), 
                      mkfg('p-2-3', 2), mkfg('p-3-3', 3) ] },

  'major-f2' : { key : 'major-f2', name : 'Major F2', 
                pos : [mkfg('p-2-1', 2), mkfg('p-4-1', 4),
                      mkfg('p-1-2', 1), mkfg('p-2-2', 2), mkfg('p-4-2', 4),
                      mkfg('p-1-3', 1), mkfg('p-3-3', 3), mkfg('p-4-3', 4)  ] },
  
  'major-f4' : { key : 'major-f4', name : 'Major F4', 
                pos : [mkfg('p-4-1', 4), 
                      mkfg('p-1-2', 1), mkfg('p-3-2', 3), mkfg('p-4-2', 4),
                      mkfg('p-1-3', 1), mkfg('p-3-3', 3), mkfg('p-5-3', 4),
                      mkfg('p-1-4', 1)  ] },
       
  'nat-minor' : { key : 'nat-minor', name : 'Nat Minor', 
                pos : [mkfg('p-1-1', 1), mkfg('p-3-1', 3), mkfg('p-4-1', 4),
                      mkfg('p-1-2', 1), mkfg('p-2-2', 2), mkfg('p-4-2', 4), 
                      mkfg('p-1-3', 1), mkfg('p-3-3', 3)  ] },

  'harm-minor' : { key : 'harm-minor', name : 'Harm Minor', 
                pos : [mkfg('p-1-1', 1), mkfg('p-3-1', 3), mkfg('p-4-1', 4),
                      mkfg('p-1-2', 1), mkfg('p-2-2', 2), mkfg('p-4-2', 4), 
                      mkfg('p-2-3', 2), mkfg('p-3-3', 3)  ] },
  
  'mel-minor' : { key : 'mel-minor', name : 'Mel Minor', 
                pos : [mkfg('p-1-1', 1), mkfg('p-3-1', 3), mkfg('p-4-1', 4),
                      mkfg('p-1-2', 1), mkfg('p-2-2', 2), mkfg('p-5-2', 4), 
                      mkfg('p-2-3', 2), mkfg('p-3-3', 3)  ] },

  'maj-penta' : { key : 'maj-penta', name : 'Maj Penta', 
                pos : [mkfg('p-2-1', 2), mkfg('p-4-1', 4), 
                      mkfg('p-1-2', 1), mkfg('p-4-2', 4), 
                      mkfg('p-1-3', 1), mkfg('p-4-3', 4) ] },
                    
  'min-penta' : { key : 'min-penta', name : 'Min Penta', 
                pos : [mkfg('p-1-1', 1), mkfg('p-4-1', 4), 
                      mkfg('p-1-2', 1), mkfg('p-3-2', 3), 
                      mkfg('p-1-3', 1), mkfg('p-3-3', 3) ] },
                          
  'dorian' : { key : 'dorian', name : 'Dorian', 
                pos : [mkfg('p-1-1', 1), mkfg('p-3-1', 3), mkfg('p-4-1', 4),
                      mkfg('p-1-2', 1), mkfg('p-3-2', 3), mkfg('p-5-2', 4), 
                      mkfg('p-1-3', 1), mkfg('p-3-3', 3) ] },
                               
  'phrygian' : { key : 'phrygian', name : 'Phrygian', 
                pos : [mkfg('p-1-1', 1), mkfg('p-2-1', 2), mkfg('p-4-1', 4),
                      mkfg('p-1-2', 1), mkfg('p-3-2', 3), mkfg('p-4-2', 4), 
                      mkfg('p-1-3', 1), mkfg('p-3-3', 3) ] },
  
  'lydian' : { key : 'lydian', name : 'Lydian', 
                pos : [mkfg('p-2-1', 2), mkfg('p-4-1', 4),
                      mkfg('p-1-2', 1), mkfg('p-3-2', 3), mkfg('p-4-2', 4),
                      mkfg('p-1-3', 1), mkfg('p-3-3', 3), mkfg('p-4-3', 4)  ] },

  'mixolydian' : { key : 'mixolydian', name : 'Mixolydian', 
                pos : [mkfg('p-2-1', 2), mkfg('p-4-1', 4),
                      mkfg('p-1-2', 1), mkfg('p-3-2', 3), mkfg('p-4-2', 4),
                      mkfg('p-1-3', 1), mkfg('p-2-3', 2), mkfg('p-4-3', 4)  ] },

  'locrian' : { key : 'locrian', name : 'Locrian', 
                pos : [mkfg('p-1-1', 1), mkfg('p-2-1', 2), mkfg('p-5-1', 4),
                      mkfg('p-1-2', 1), mkfg('p-2-2', 2), mkfg('p-5-2', 4), 
                      mkfg('p-1-3', 1), mkfg('p-3-3', 3) ] },


}

@Component({
  selector: 'app-bass-scales',
  templateUrl: './bass-scales.component.html',
  styleUrls: ['./bass-scales.component.scss']
})
export class BassScalesComponent implements OnInit {

  all_scales = scale_positions;

  scaleName = 'major-f1';
  scalePositions = scale_positions['major-f1'].pos;
  scaleList = Object.keys(this.all_scales);


  constructor(private activeRoute: ActivatedRoute, private router : Router,
    private help_text : HelpTextEmitterService) {
  }

  ngOnInit(): void {
    this.help_text.setHelp({ help_text : HELP_TEXT, page_name : HELP_PAGE_NAME });

    this.activeRoute.queryParams
    .subscribe(params => {
        const sn = params['scale'];
        if (sn) {
          const scaleName = (sn as string).toLowerCase();
          if (scaleName in scale_positions) {
              this.scaleName = scaleName;
              this.scalePositions = scale_positions[scaleName].pos;
          }
        } else {
          this.router.navigate( [], 
            {
              relativeTo: this.activeRoute,
              queryParams: {scale : this.scaleName}, 
              queryParamsHandling: 'merge',
            }
          );
          this.scalePositions = this.all_scales[this.scaleName].pos;
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
    return (this.scaleName === scale ? 'activeNavButton' : 'navButton');
  }

  randomScale() {

    let newScale = this.scaleName;
    const chooser = equalWeightedChooser(this.scaleList);
    while (newScale === this.scaleName) {
      newScale = chooser.choose();
    }
    this.scaleChange(newScale);
  }
}
