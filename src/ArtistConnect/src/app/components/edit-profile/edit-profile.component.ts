import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  userProfileImage = 'https://firebasestorage.googleapis.com/v0/b/artistconnect-721d1.appspot.com/o/images%2F' + this.firebase.userData.uid + '.jpg?alt=media'

  constructor(public firebase: FirebaseService) { }
  newDisplayName!: string;
  newCountry!: string;
  newCounty!: string;
  newDob!: string;

  ngOnInit(): void {
  }

  editUserProfile() {
    console.log(this.newCountry, this.newCounty, this.newDob, this.newDisplayName);
    this.firebase.setUserDataRegister(this.firebase.userData, this.newDisplayName, this.newDob, this.newCountry, this.newCounty);
  }

}
