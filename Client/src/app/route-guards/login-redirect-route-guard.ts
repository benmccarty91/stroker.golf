import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CONSTS } from 'src/assets/CONSTS';
import { AuthService } from 'src/services/AuthService';
import { PubSubService } from 'src/services/PubSubService';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService,
    private pubSubService: PubSubService,
    private consts: CONSTS
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.fireAuth.getRedirectResult().then(cred => {
      if (cred.user != null) {
        this.router.navigateByUrl('/landing');
        this.pubSubService.$pub(this.consts.EVENTS.LOGGED_IN);
        this.authService.registerUser(cred.user);
        return false;
      }
      return true;
    });
  }


}