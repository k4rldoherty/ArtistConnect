import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengeCenterComponent } from './messenge-center.component';

describe('MessengeCenterComponent', () => {
  let component: MessengeCenterComponent;
  let fixture: ComponentFixture<MessengeCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessengeCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessengeCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
