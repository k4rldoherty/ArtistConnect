import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IPlayerComponent } from './i-player.component';

describe('IPlayerComponent', () => {
  let component: IPlayerComponent;
  let fixture: ComponentFixture<IPlayerComponent>;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule
      ],
      declarations: [ IPlayerComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IPlayerComponent);
    component = fixture.componentInstance;
    sanitizer = TestBed.inject(DomSanitizer);

    // Set the test data
    component.data = {
      songUrl: 'https://example.com/song.mp3',
      trackId: '12345'
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set songUrl and trackId on ngOnInit', () => {
    expect(component.songUrl).toEqual('https://example.com/song.mp3');
    expect(component.trackId).toEqual('12345');
  });

});