import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { BASE_PAGE } from 'src/app/shared/BasePage';
import { CONSTS } from 'src/assets/CONSTS';
import { ApiService } from 'src/services/ApiService';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss']
})
export class AddFriendComponent extends BASE_PAGE implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  public submitStatus: string = '';
  public failureString: string = '';
  public userInput: string;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private pubsub: PubSubService,
    private consts: CONSTS
  ) {
    super(pubsub, consts);
  }

  ngOnInit(): void {
  }

  addFriendClicked(): void {
    if (!this.emailFormControl.hasError('email') && !this.emailFormControl.hasError('required')) {
      this.apiService.post('/friend', { email: this.userInput }).subscribe(x => {
        this.submitStatus = 'success';
      },
        err => {
          if (typeof(err === 'HttpErrorResponse')) {
            this.handleApiPostError(err);
          }
          this.submitStatus = 'fail';
        });
    }
  }

  findAnother(): void {
    this.userInput = '';
    this.submitStatus = '';
  }

  friendList(): void {
    this.router.navigateByUrl('/friends');
  }

  goHome(): void {
    this.router.navigateByUrl('/landing');
  }

  private handleApiPostError(err: HttpErrorResponse): void {
    switch (err.status) {
      case 404: // user doesn't exsit
        this.failureString = `That person doesn't have an account.`;
        break;
      case 400: // not a valid email (or you searched for yourself)
        this.failureString = `There's something wrong with the email address you provided.`;
        break;
      case 409: // you already have that friend
        this.failureString = `You are already friends with that person, or you already have a pending friend request.`;
        break;
      default: // everything else
        this.failureString = `We couldn't submit your request because we couldn't connect to the interwebs.`;
        break;
    }
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
