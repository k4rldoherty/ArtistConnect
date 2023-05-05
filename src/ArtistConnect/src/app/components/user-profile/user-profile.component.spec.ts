import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { UserProfileComponent } from './user-profile.component';
import { FirebaseService } from 'src/app/services/firebase.service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  const routeMock = {
    snapshot: {
      paramMap: {
        get: () => 'mockUid'
      }
    }
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  const firestoreMock = {
    doc: jasmine.createSpy('doc').and.returnValue({
      valueChanges: () => of({}),
    }),
    collection: jasmine.createSpy('collection').and.returnValue({
      snapshotChanges: () => of([]),
    }),
  };

  const firebaseServiceMock = {
    isFollowingUser: () => of(false),
    getFollowersCount: () => of(0),
    getFollowingCount: () => of(0),
    follow: () => {},
    unfollow: () => {},
    createConversation: () => {},
    userData: {
      uid: 'mockUserUid',
    },
  };

  const angularFireAuthMock = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: Router, useValue: routerMock },
        { provide: AngularFirestore, useValue: firestoreMock },
        { provide: AngularFireAuth, useValue: angularFireAuthMock },
        { provide: FirebaseService, useValue: firebaseServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increase followers when follow() is called', () => {
    
    spyOn(firebaseServiceMock, 'follow').and.stub();
  
  
    component.follow();
  
    
    expect(component.followers).toBe(1);
    expect(component.isFollowing).toBeTrue();
  });
  
  it('should decrease followers when unFollow() is called', () => {
    
    component.followers = 1;
    component.isFollowing = true;
  
    
    spyOn(firebaseServiceMock, 'unfollow').and.stub();
  
    component.unFollow();
  
    expect(component.followers).toBe(0);
    expect(component.isFollowing).toBeFalse();
  });

  
});
