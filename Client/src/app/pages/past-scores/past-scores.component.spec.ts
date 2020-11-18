import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastScoresComponent } from './past-scores.component';

describe('PastScoresComponent', () => {
  let component: PastScoresComponent;
  let fixture: ComponentFixture<PastScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastScoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PastScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
