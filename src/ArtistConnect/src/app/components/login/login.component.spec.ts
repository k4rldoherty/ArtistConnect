import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let firebaseServiceSpy: jasmine.SpyObj<FirebaseService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('FirebaseService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [{ provide: FirebaseService, useValue: spy }],
      imports: [FormsModule],
    }).compileComponents();

    firebaseServiceSpy = TestBed.inject(FirebaseService) as jasmine.SpyObj<FirebaseService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isSignedIn to true when user is logged in', async () => {
    firebaseServiceSpy.isLoggedIn = true;

    await component.login();

    expect(component.isSignedIn).toBeTrue();
  });


  it('should show alert when email or password is empty', async () => {
    spyOn(window, 'alert');

    component.email = '';
    component.password = '';

    await component.login();

    expect(window.alert).toHaveBeenCalled();
  });
});