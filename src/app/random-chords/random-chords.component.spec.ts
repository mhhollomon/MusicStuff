import { ComponentFixture, TestBed } from '@angular/core/testing';

import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatGridListModule} from '@angular/material/grid-list';

import { RandomChordsComponent } from './random-chords.component';



describe('RandomChordsComponent', () => {
  let component: RandomChordsComponent;
  let fixture: ComponentFixture<RandomChordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports : [
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatExpansionModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatRadioModule,
        MatGridListModule,
        NoopAnimationsModule,
      ],
      declarations: [ RandomChordsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomChordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
