import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  userProfileImage = 'https://firebasestorage.googleapis.com/v0/b/artistconnect-721d1.appspot.com/o/images%2F' + this.firebase.userData.uid + '.jpg?alt=media'

  constructor(public firebase: FirebaseService, public dialogRef: MatDialogRef<EditProfileComponent>) { }
  newDisplayName: string = this.firebase.userData.displayName;
  newCountry: string = this.firebase.userData.country;
  newCounty: string = this.firebase.userData.county;
  newDob: string = this.firebase.userData.dob;

  ngOnInit(): void {
  }

  editUserProfile() {
    this.firebase.setUserDataRegister(this.firebase.userData, this.newDisplayName.toLowerCase(), this.newDob, this.newCountry, this.newCounty);
    this.dialogRef.close();
  }

}
