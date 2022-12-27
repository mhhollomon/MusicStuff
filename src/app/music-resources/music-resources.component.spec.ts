import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicResourcesComponent } from './music-resources.component';

describe('MusicResourcesComponent', () => {
  let component: MusicResourcesComponent;
  let fixture: ComponentFixture<MusicResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
