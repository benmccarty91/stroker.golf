import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-live-game-friend-teebox-select',
  template: `
  <div class="column_div">
    <h3>Which teebox are they playing?</h3>
    <mat-card *ngFor="let friend of workingSummary.friendSummary" class="column_div">
      <h4>{{friend.Friend.Name}}</h4>

      <mat-form-field appearance="fill">
        <mat-label>Teebox</mat-label>
        <mat-select [(value)]="friend.Teebox">
          <mat-option *ngFor="let teebox of workingSummary.selectedCourse.TeeBoxes" [value]="teebox">
            {{teebox.Color}}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-card>

    <button mat-stroked-button (click)="submit()">Next</button>
  </div>
  `,
  styles: [`
    .column_div {
      display: flex;
      flex-direction: column;
    }

    mat-card {
      margin-bottom: 25px;
    }
  `]
})
export class FriendTeeboxSelect {

  @Input() workingSummary: any;
  @Input() submitHandler: Function;

  constructor(

  ) {}

  public submit(): void {
    this.submitHandler();
  }

}