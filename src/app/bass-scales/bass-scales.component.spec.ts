import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute} from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { BassScalesComponent } from './bass-scales.component';

describe('BassScalesComponent', () => {
  let component: BassScalesComponent;
  let fixture: ComponentFixture<BassScalesComponent>;

  const mockActivatedRoute = {
    queryParams : of({
      scale : 'major-f1'
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSidenavModule, NoopAnimationsModule],
      declarations: [ BassScalesComponent ],
      providers : [ { provide : ActivatedRoute, useValue : mockActivatedRoute }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BassScalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
