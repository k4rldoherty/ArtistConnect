import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { SongRecommenderComponent } from './song-recommender.component';
import { IPlayerComponent } from '../i-player/i-player.component';

describe('SongRecommenderComponent', () => {
  let component: SongRecommenderComponent;
  let fixture: ComponentFixture<SongRecommenderComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of(convertToParamMap({ inputVal: 'sample_track_url' })),
          },
        },
      ],
      declarations: [SongRecommenderComponent, IPlayerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongRecommenderComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onGenerateRecommendations on ngOnInit', () => {
    spyOn(component, 'onGenerateRecommendations');
    component.ngOnInit();
    expect(component.onGenerateRecommendations).toHaveBeenCalled();
  });

  it('should open iPlayer dialog when onPlaySong is called', () => {
    spyOn(dialog, 'open');
    component.onPlaySong('song_id');
    expect(dialog.open).toHaveBeenCalledWith(IPlayerComponent, jasmine.any(Object));
  });

  
});
