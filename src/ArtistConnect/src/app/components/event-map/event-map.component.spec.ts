import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventMapComponent } from './event-map.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, BrowserModule } from '@angular/platform-browser';

describe('EventMapComponent', () => {
  let component: EventMapComponent;
  let fixture: ComponentFixture<EventMapComponent>;
  let sanitizer: DomSanitizer;

  const mockData = {
    venue: 'Test Venue',
    city: 'Test City',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventMapComponent],
      imports: [BrowserModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventMapComponent);
    component = fixture.componentInstance;
    sanitizer = TestBed.inject(DomSanitizer);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate a sanitized URL for the map', () => {
    const sanitizedUrl = sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed/v1/place?q=Test%20Venue%20Test%20City&key=AIzaSyCkzjjQv5IUTC0yz1HTYDtP8KFvx2xuWwM'
    );
    expect(component.link).toEqual(sanitizedUrl);
  });
});
