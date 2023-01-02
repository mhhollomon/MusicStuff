import { ComponentFixture, TestBed } from '@angular/core/testing';

import {MatCardModule} from '@angular/material/card';


import { MusicResourcesComponent } from './music-resources.component';

describe('MusicResourcesComponent', () => {
  let component: MusicResourcesComponent;
  let fixture: ComponentFixture<MusicResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports : [
        MatCardModule,
      ],
      declarations: [ MusicResourcesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
