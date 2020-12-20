import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-number-picker-small',
  template: `
    <div id="numberPicker">
      <mat-grid-list cols="2" rowHeight="35px">
        <mat-grid-tile [rowspan]="2" [colspan]="1">
          <mat-form-field class="input-form">
            <input matInput type="number" autocomplete="off" [(ngModel)]="num" (keyup)="publishNumber()">
          </mat-form-field>
        </mat-grid-tile>
        <mat-grid-tile [rowspan]="1" [colspan]="1">
          <button mat-icon-button (click)="increment()">
            <mat-icon>keyboard_arrow_up</mat-icon>
          </button>
        </mat-grid-tile>
        <mat-grid-tile [rowspan]="1" [colspan]="1">
          <button mat-icon-button *ngIf="num > 0" (click)="decrement()">
            <mat-icon>keyboard_arrow_down</mat-icon>
          </button>
        </mat-grid-tile>
      </mat-grid-list>
    </div>
  `,
  styles: [
    `
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }

    #numberPicker {

      min-width: 115px;
      max-width: 115px;

      margin:0 auto;
    }
    
    .input-form {
        width: 50px;
        text-align: center;
      }
    `
  ]
})
export class NumberPickerSmallComponent implements OnInit {

  @Input() inNumber: number;
  @Output() outNumber = new EventEmitter<number>();
  public num: number;

  constructor() { }

  ngOnInit(): void {
    if (this.inNumber) {
      this.num = this.inNumber;
      this.outNumber.emit(this.num);
    }
  }

  public increment(): void {
    if (!this.num) {
      this.num = 0;
    }
    this.num++;
    this.publishNumber();
  }

  public decrement(): void {
    if (!this.num) {
      this.num = 0;
    }
    this.num--;
    this.publishNumber();
  }

  public publishNumber(): void {
    this.outNumber.emit(this.num);
  }

  public hiddenClass(): boolean {
    return (!this.num || this.num < 1);
  }

}
