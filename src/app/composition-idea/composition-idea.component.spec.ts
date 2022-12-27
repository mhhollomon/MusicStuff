import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionIdeaComponent } from './composition-idea.component';

describe('CompositionIdeaComponent', () => {
  let component: CompositionIdeaComponent;
  let fixture: ComponentFixture<CompositionIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompositionIdeaComponent ]
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
