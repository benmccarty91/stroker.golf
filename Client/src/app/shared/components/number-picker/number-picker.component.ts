import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.scss']
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

}
