import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLiveGameComponent } from './new-live-game.component';

describe('NewLiveGameComponent', () => {
  let component: NewLiveGameComponent;
  let fixture: ComponentFixture<NewLiveGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLiveGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLiveGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
