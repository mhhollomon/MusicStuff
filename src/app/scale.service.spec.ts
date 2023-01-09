import { TestBed } from '@angular/core/testing';
import { Chooser, mkch } from './utils/chooser';
import { Scale, Note } from './utils/music-theory/music-theory';

import { ScaleService } from './scale.service';


describe('ScaleService', () => {
  let service: ScaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("correctly caches scale notes", () => {
    const scale = new Scale("G", 'major');

    const retval = [ 'G', 'A', 'B', 'C', 'D', 'E', 'F#'].map(v => new Note(v));

    const theSpy = spyOn(scale, 'notesOfScale').and.callThrough();

    expect(service.getScaleNotes(scale)).withContext("first time").toEqual(retval);
    expect(theSpy).withContext("first time").toHaveBeenCalled();
    theSpy.calls.reset();

    expect(service.getScaleNotes(scale)).withContext("second time").toEqual(retval);
    expect(theSpy).withContext("second time").not.toHaveBeenCalled();

  });

  it ("correctly chooses from the correct list when sonority is given", () => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (<any>service).minorChooser = new Chooser([mkch(new Scale('A', 'minor'), 1)]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (<any>service).majorChooser = new Chooser([mkch(new Scale('C', 'major'), 1)]);

    expect(service.choose('minor').root()).withContext('choosing minor').toEqual('A');
    expect(service.choose('major').root()).withContext('choosing major').toEqual('C');

  });

});
