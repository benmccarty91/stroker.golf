import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { finalize, map, mergeMap } from 'rxjs/operators';
import { CONSTS } from 'src/assets/CONSTS';
import { StrokerUser } from 'src/models/StrokerUser';
import { PubSubService } from 'src/services/PubSubService';
import { UserService } from 'src/services/UserService';
import { ChangePhotoDialogComponent } from './changePhoto.dialog';

@Component({
  selector: 'app-profile-edit',
  template: `
  <div *ngIf="!loading">
    <mat-card>
      <div id="flowContainer">
        <img class="avatar" src={{user.photoUrl}}>
        <button mat-flat-button color="primary" (click)="photoDialog()">Change Photo</button>
        <mat-form-field class="full-width">
          <mat-label>Name</mat-label>
          <input type="text" matInput [(ngModel)]="user.displayName" autocomplete="off">
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Email Address</mat-label>
          <input type="email" matInput [formControl]="emailFormControl" [errorStateMatcher]="matcher"
            [(ngModel)]="user.email" autocomplete="off">
          <mat-error *ngIf="emailFormControl.hasError('email') && !emailFormControl.hasError('required')">
            Please enter a valid email address
          </mat-error>
          <mat-error *ngIf="emailFormControl.hasError('required')">
            Email is <strong>required</strong>
          </mat-error>
        </mat-form-field>

      </div>
    </mat-card>

    <button mat-fab class="profile_fab" color="accent" (click)="save()">
      <mat-icon>save</mat-icon>
    </button>
  </div>
  `,
  styles: [`
  #flowContainer {
    margin-top:15px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .profile_fab {
    position: absolute;
    bottom: 15px;
    right: 15px;
  }

  .avatar {
    width: 60%;
    border-radius: 50%;
    margin-bottom:15px;
  }

  .full-width {
    width: 100%;
    margin-bottom:15px;
  }
  `]
})
export class EditProfileComponent implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  public loading: Boolean = true;
  public user: StrokerUser;

  private newImage: File;

  constructor(
    private userService: UserService,
    private pubSub: PubSubService,
    private consts: CONSTS,
    private dialog: MatDialog,
    private fireStorage: AngularFireStorage,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.loading = false;
      this.pubSub.$pub(this.consts.EVENTS.PAGE_LOAD_COMPLETE);
    });
  }

  public photoDialog() {
    this.dialog.open(
      ChangePhotoDialogComponent
    ).afterClosed().subscribe(res => {
      if (res) {
        this.user.photoUrl = res.newImageUrl;
        this.newImage = res.newImage;
      }
      console.log(res);
    });
  }

  public onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.user.photoUrl = event.target.result as string;
      }
    }
  }

  public save() {
    this.pubSub.$pub(this.consts.EVENTS.DATA_LOAD_START);
    this.uploadFile_getUrl(`profileImages/${this.user.id}/photo`, this.newImage).subscribe((url) => {
      if (url) {
        this.user.photoUrl = url;
      }
      this.userService.updateProfile(this.user).subscribe(() => {
        this.router.navigateByUrl('/profile');
      },
        (err) => {
          alert('an error occured');
          console.error(err);
          this.pubSub.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
        });
    })
  }

  // TODO: pull this into a service for FireStorage
  private uploadFile_getUrl(path: string, file: File): Observable<string> {
    if (!path || !file) {
      return of('');
    }
    const fileRef = this.fireStorage.ref(path);
    return from(this.fireStorage.upload(path, file).then(() => { })).pipe(
      mergeMap(() => {
        return fileRef.getDownloadURL() as Observable<string>;
      })
    );
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}