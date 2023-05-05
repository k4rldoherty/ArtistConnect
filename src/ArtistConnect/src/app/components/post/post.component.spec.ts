import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { PostComponent } from './post.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore/';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { environment } from 'src/environments/environment';
import { IPlayerComponent } from '../i-player/i-player.component';
import { CommentsViewComponent } from '../comments-view/comments-view.component';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostComponent],
      imports: [
        HttpClientTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFireFunctionsModule,
        MatDialogModule,
        MatSnackBarModule,
        RouterTestingModule,
        AngularFirestoreModule
      ],
      providers: [MatDialog]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog)
    component.postData = {
      did: 'testPostId',
      uid: 'testUserId',
      songUrl: 'https://example.com/song',
      source: 'Spotify',
      id: 'testTrackId',
      timestamp: '2023-05-01',
      songName: 'testSong',
      artist: 'artist',
      type: 'song',
      eventName: 'testName',
      eventUrl: 'url',
      desc: 'string string',
      organiser: 'tm',
      image: 'url',
      eventDetails: {
        name: 'Test Event',
        venue: 'Test Venue',
        city: 'Test City',
        url: 'https://example.com/tickets'
      }
    };
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the post creator', () => {
    component.firebase.userData = { displayName: 'Mike' }
    component.creator = { displayName: 'John Doe' };
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const creatorNameElement = compiled.querySelector('.creator-name');
    expect(creatorNameElement.textContent).toContain('John Doe');
  });


  it('should display the like count', () => {
    component.count = 5;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const likeCountElement = compiled.querySelector('.like-count');
    expect(likeCountElement.textContent).toContain('5');
  });


  it('should open iPlayer dialog when onPlayClick is called', () => {
    spyOn(dialog, 'open');
    component.onPlayClick();
    expect(dialog.open).toHaveBeenCalledWith(IPlayerComponent, jasmine.any(Object));
  });

  it('should open comment dialog on comment click', () => {
    component.creator = { displayName: 'John Doe' };
    spyOn(dialog, 'open');
    component.onCommentClick();
    expect(dialog.open).toHaveBeenCalledWith(CommentsViewComponent, jasmine.any(Object));
  });
});