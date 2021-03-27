import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  template: `
    <p>Only submit nine?</p>
  `, 
  styles: [`
  
  `]
})
export class NineHoleConfirmComponent {

  constructor(
    private dialogRef: MatDialogRef<NineHoleConfirmComponent>,
  ) {}

  
}