import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const mockFirebaseService = {
    logout: () => {},
    setSearchValue: (searchTerm: string) => {},
    searchPressed$: of(false),
    userData: { displayName: 'Test User' },
  };

  const mockRouter = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        BrowserModule,
        FormsModule,
        FontAwesomeModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatButtonModule,
      ],
      providers: [
        { provide: FirebaseService, useValue: mockFirebaseService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
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
