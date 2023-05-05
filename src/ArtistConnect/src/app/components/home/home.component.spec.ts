import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { CreatePostComponent } from '../create-post/create-post.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const mockFirebaseService = {
    searchPressed$: of(false),
    searchValue$: of(''),
    userData: { uid: '1' },
    logout: () => {},
  };

  const mockMatDialog = {
    open: () => {},
  };

  const mockAngularFirestore = {
    collection: () => ({
      valueChanges: () => of([]),
    }),
  };

  const mockAngularFireAuth = {
    authState: of({ uid: '1' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: FirebaseService, useValue: mockFirebaseService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: AngularFirestore, useValue: mockAngularFirestore },
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call logout method of the FirebaseService', () => {
    const logoutSpy = spyOn(mockFirebaseService, 'logout');
    component.logout();
    expect(logoutSpy).toHaveBeenCalled();
  });
});
