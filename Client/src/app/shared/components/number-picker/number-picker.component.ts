import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-number-picker',
  template: `
    <div id="container">
      <mat-form-field class="input-form">
        <input matInput type="number" autocomplete="off" [(ngModel)]="num" (keyup)="publishNumber()">
      </mat-form-field>
      <div id="buttonGroup">
        <button mat-icon-button (click)="increment()">
          <mat-icon>keyboard_arrow_up</mat-icon>
        </button>
        <button mat-icon-button [ngClass]="{'hidden': hiddenClass()}" (click)="decrement()">
          <mat-icon>keyboard_arrow_down</mat-icon>
        </button>
      </div>
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

    #container {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    #buttonGroup {
      margin: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }

    mat-icon {
      font-size: xxx-large;
      width: auto;
      height: auto;
    }

    mat-form-field {
      font-size: xxx-large;
      text-align: center;
      max-width: 100px;
    }

    .hidden {
      visibility: hidden;
    }
    `
  ]
})
export class NumberPickerComponent implements OnInit {

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
