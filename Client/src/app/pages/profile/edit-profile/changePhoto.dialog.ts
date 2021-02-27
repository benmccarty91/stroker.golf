import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CONSTS } from 'src/assets/CONSTS';
import { PubSubService } from 'src/services/PubSubService';

@Component({
  selector: 'app-photo-change-dialog',
  template: `
    <div id="flexContainer">
      <img *ngIf="newImageUrl" src={{newImageUrl}} class="avatar" />
      <button mat-flat-button color="primary" (click)="fileInput.click()">Choose Photo</button>
      <input hidden (change)="onFileSelected($event)" #fileInput type="file" id="file">
      <div id="rowContainer">
        <button *ngIf="newImageUrl" mat-flat-button color="accent" (click)="submit()">Submit</button>
        <button *ngIf="newImageUrl" mat-stroked-button color="primary" (click)="cancel()">Cancel</button>
      </div>
    </div>
  `,
  styles: [
    `
    #flexContainer {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    #rowContainer {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
    }

    .avatar {
      max-width: 200px;
      border-radius: 50%;
      margin-bottom: 15px;
    }

    button {
      margin: 15px;
    }
    `
  ]
})
export class ChangePhotoDialogComponent implements OnInit {

  public newImageUrl: string = "";
  public newImage: File;

  constructor(
    public dialogRef: MatDialogRef<ChangePhotoDialogComponent>,
    public pubSub: PubSubService,
    public consts: CONSTS
  ) { }

  ngOnInit(): void {
  }

  submit(): void {
    this.dialogRef.close({ 'newImageUrl': this.newImageUrl, 'newImage': this.newImage });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onFileSelected(event) {
    this.pubSub.$pub(this.consts.EVENTS.DATA_LOAD_START);
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      this.newImageUrl = event.target.result as string;
      this.newImage = file;
      this.pubSub.$pub(this.consts.EVENTS.DATA_LOAD_COMPLETE);
    }
    fileReader.readAsDataURL(file);
  }

}
