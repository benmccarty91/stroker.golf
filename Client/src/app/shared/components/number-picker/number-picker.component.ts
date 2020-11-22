import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.scss']
})
export class NumberPickerComponent implements OnInit {

  @Output() outNumber = new EventEmitter<number>();
  public num: number;

  constructor() { }

  ngOnInit(): void {
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
