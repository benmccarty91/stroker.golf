import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2>
      Are you sure?
    </h2>
    <p>This can't be recovered</p>
    <button mat-stroked-button color="warn" (click)="confirm()">Confirm</button>
    <button mat-flat-button color="primary" cdkFocusInitial (click)="cancel()">Cancel</button>
  `,
  styles: [
    `
    * {
      margin: 0;
    }

    p {
      margin: 10px 0;
    }

    button {
      width: 46%;
      margin: 0 2%;
    }
    `
  ]
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

  ngOnInit(): void {
  }

  confirm(): void {
    this.dialogRef.close('confirm');
  }

  cancel(): void {
    this.dialogRef.close('cancel');
  }

}
