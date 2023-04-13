import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongRecommenderComponent } from './song-recommender.component';

describe('SongRecommenderComponent', () => {
  let component: SongRecommenderComponent;
  let fixture: ComponentFixture<SongRecommenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongRecommenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongRecommenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
