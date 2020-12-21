import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-submit-success',
  template: `
    <div id="container">
      <h2>Success!</h2>
      <p>Your score has been recorded.</p>
      <button mat-stroked-button (click)="submit()">Go Home</button>
    </div>
  `,
  styles: [
    `
    * {
      margin: 0;
      margin-top: 10px;
    }

    #container {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-content: stretch;
    }
    `
  ]
})
export class SubmitSuccessComponent implements OnInit {

  @Input() submitHandler: Function;

  constructor() { }

  ngOnInit(): void {
  }

  submit(): void {
    this.submitHandler();
  }

}
