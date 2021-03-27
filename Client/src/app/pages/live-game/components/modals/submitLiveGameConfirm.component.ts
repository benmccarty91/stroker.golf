import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  template: `
    <h3>Ready to Submit?</h3>
    <button mat-stroked-button color="warn" (click)="confirm()">Confirm</button>
    <button mat-flat-button color="primary" cdkFocusInitial (click)="cancel()">Cancel</button>
  `, 
  styles: [`
  * {
    margin: 0;
  }

  h3 {
    margin: 10px 0;
  }

  button {
    width: 46%;
    margin: 0 2%;
  }
  `]
})
export class SubmitLiveGameConfirmComponent {

  constructor(
    private dialogRef: MatDialogRef<SubmitLiveGameConfirmComponent>,
  ) {}

  public confirm(): void {
    console.log('confirmed');
    this.dialogRef.close('confirm');
  }

  public cancel(): void {
    console.log('canceled');
    this.dialogRef.close('cancel');
  }


}