import { ComponentFixture, TestBed } from '@angular/core/testing';

import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';
import { ActivatedRoute} from '@angular/router';

import { CompositionIdeaComponent } from './composition-idea.component';
import { of } from 'rxjs';

describe('CompositionIdeaComponent', () => {
  let component: CompositionIdeaComponent;
  let fixture: ComponentFixture<CompositionIdeaComponent>;

  const mockActivatedRoute = {
    queryParams : of({
      mode : 'Orchestral'
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatButtonToggleModule, FormsModule],
      declarations: [ CompositionIdeaComponent ],
      providers : [ { provide : ActivatedRoute, useValue : mockActivatedRoute }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompositionIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
