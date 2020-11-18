import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordNewRoundComponent } from './record-new-round.component';

describe('RecordNewRoundComponent', () => {
  let component: RecordNewRoundComponent;
  let fixture: ComponentFixture<RecordNewRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordNewRoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordNewRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
