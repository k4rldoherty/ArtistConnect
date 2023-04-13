import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFinderComponent } from './event-finder.component';

describe('EventFinderComponent', () => {
  let component: EventFinderComponent;
  let fixture: ComponentFixture<EventFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventFinderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
