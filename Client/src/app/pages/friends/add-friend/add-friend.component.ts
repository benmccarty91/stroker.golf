import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { CONSTS } from 'dist/Client/assets/CONSTS';
import { BASE_PAGE } from 'src/app/shared/BasePage';
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
      this.apiService.post('/friend', this.userInput).subscribe(x => {
        this.submitStatus = 'success';
      },
      err => {
        this.submitStatus = 'fail';
      });
    }
  }

  findAnother(): void {
    this.userInput = '';
    this.submitStatus = '';
  }

  goHome(): void {
    this.router.navigateByUrl('/landing');
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
