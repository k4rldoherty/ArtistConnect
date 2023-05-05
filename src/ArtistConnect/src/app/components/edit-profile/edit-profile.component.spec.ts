import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { EditProfileComponent } from './edit-profile.component';
import { FirebaseService } from 'src/app/services/firebase.service';

class MockFirebaseService {
  userData = { uid: 'testUid' };
}

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditProfileComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: FirebaseService, useClass: MockFirebaseService },
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call editUserProfile() when Save button is clicked', () => {
    spyOn(component, 'editUserProfile');
    const buttonElement = fixture.debugElement.nativeElement.querySelector('button');
    buttonElement.click();
    expect(component.editUserProfile).toHaveBeenCalled();
  });

});
