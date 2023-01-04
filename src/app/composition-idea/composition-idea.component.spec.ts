import { ComponentFixture, TestBed } from '@angular/core/testing';

import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';

import { CompositionIdeaComponent } from './composition-idea.component';

describe('CompositionIdeaComponent', () => {
  let component: CompositionIdeaComponent;
  let fixture: ComponentFixture<CompositionIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatButtonToggleModule, FormsModule],
      declarations: [ CompositionIdeaComponent ],
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
