import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PubSubService {

  private events = new Array<Subject<any>>();

  public $sub(event: string): Observable<any> {
    if (!event) {
      throw new Error('.$sub() must have event name');
    }

    if (this.events[event] === undefined) {
      this.events[event] = new Subject<any>();
    }

    return this.events[event].asObservable();
  }

  public $pub(event: string): void {
    if (!event) {
      throw new Error('.$pub() must have event name');
    } else if (!this.events[event]) {
      return;
    }

    this.events[event].next();
  }
}
