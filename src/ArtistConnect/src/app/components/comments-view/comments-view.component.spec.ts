import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CommentsViewComponent } from './comments-view.component';
import { environment } from 'src/environments/environment';


const mockFirebaseService = {
  getUser: () => of({ displayName: 'Test User' })
};

describe('CommentsViewComponent', () => {
  let component: CommentsViewComponent;
  let fixture: ComponentFixture<CommentsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        MatDialogModule
      ],
      declarations: [CommentsViewComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { postID: 'test_post_id' } },
        { provide: FirebaseService, useValue: mockFirebaseService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
