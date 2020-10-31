import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private userAgent = navigator.userAgent || navigator.vendor;

  constructor() { }

  public isIOS(): boolean { // may not work as intended, I stole this from stack overflow
    return (/iPad|iPhone|iPod/.test(this.userAgent) && !window.MSStream);
  }

  public isAndroid(): boolean {
    return (/android/i.test(this.userAgent));
  }
}
