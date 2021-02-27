import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public opened: boolean;

  @Output() toggleSidenav = new EventEmitter<void>();
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  profileClicked(): void {
    this.router.navigateByUrl('/profile');
  }

}
