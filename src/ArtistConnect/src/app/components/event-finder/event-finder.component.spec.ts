import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventFinderComponent } from './event-finder.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

describe('EventFinderComponent', () => {
  let component: EventFinderComponent;
  let fixture: ComponentFixture<EventFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventFinderComponent],
      imports: [
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        FormsModule
      ],
      providers: [
        { provide: FirebaseService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: AngularFirestore, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
