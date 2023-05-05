import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  // Create mock objects for dependencies
  const firebaseServiceMock = {
    getFollowersCount: jasmine.createSpy('getFollowersCount').and.returnValue(of(0)),
    getFollowingCount: jasmine.createSpy('getFollowingCount').and.returnValue(of(0)),
    userData: {
      displayName: 'Test User',
      county: 'Test County',
      country: 'Test Country',
    },
  };

  const angularFirestoreMock = {
    collection: jasmine.createSpy('collection').and.returnValue({
      snapshotChanges: () => of([]),
    }),
  };

  const matDialogMock = {
    open: jasmine.createSpy('open'),
  };

  const angularFireAuthMock = {
    authState: of(null),
  };

  const angularFireStorageMock = {};
  const routerMock = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ProfileComponent],
      providers: [
        { provide: FirebaseService, useValue: firebaseServiceMock },
        { provide: AngularFirestore, useValue: angularFirestoreMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: AngularFireAuth, useValue: angularFireAuthMock },
        { provide: AngularFireStorage, useValue: angularFireStorageMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call openDialog when the "Edit Your Profile" button is clicked', () => {
    spyOn(component, 'openDialog');

    const editProfileButton = fixture.debugElement.query(By.css('button[mat-stroked-button]'));
    editProfileButton.triggerEventHandler('click', null);

    expect(component.openDialog).toHaveBeenCalled();
  });
});
