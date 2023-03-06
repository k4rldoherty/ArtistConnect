import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IPlayerComponent } from './i-player.component';

describe('IPlayerComponent', () => {
  let component: IPlayerComponent;
  let fixture: ComponentFixture<IPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
