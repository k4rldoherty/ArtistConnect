import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MessengeCenterComponent } from './messenge-center.component';

describe('MessengeCenterComponent', () => {
  let component: MessengeCenterComponent;
  let fixture: ComponentFixture<MessengeCenterComponent>;

  const userData = {
    displayName: 'John Doe',
  };


  const firestoreMock = {
    collection: jasmine.createSpy('collection').and.returnValue({
      doc: jasmine.createSpy('doc').and.returnValue({
        get: () => of({ data: () => ({ conversations: ['conversation1', 'conversation2'] }) }),
      }),
    }),
  };

  const authServiceMock = {
    authState: of({
      uid: 'testUserId',
    }),
  };

  const firebaseServiceMock = {
    userData,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MessengeCenterComponent],
      providers: [
        { provide: AngularFireAuth, useValue: authServiceMock },
        { provide: AngularFirestore, useValue: firestoreMock },
        { provide: FirebaseService, useValue: firebaseServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengeCenterComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user display name in the welcome message', () => {
    const compiled = fixture.nativeElement;
    const welcomeMessage = compiled.querySelector('.title h3');
    expect(welcomeMessage.textContent).toContain(userData.displayName.split(' ')[0]);
  });

});
