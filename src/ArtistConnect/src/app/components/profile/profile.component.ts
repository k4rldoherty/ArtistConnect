import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { normalUser } from 'src/app/models/users';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  testPosts = [
    {
      author: "your ma",
      data: "Test Post 23874634324"
    },
    {
      author: "your ma",
      data: "Test Post 23874634324"
    },
    {
      author: "your ma",
      data: "Test Post 23874634324"
    },
    {
      author: "your ma",
      data: "Test Post 23874634324"
    },
  ]

  testFollowers = [
    {
      name: "Jimmy"
    },
    {
      name: "Yury"
    },    
    {
      name: "Conor"
    },    
    {
      name: "Mark"
    },
  ]

  testFollowing = [
    {
      name: "Jimmy"
    },
    {
      name: "Yury"
    },    
    {
      name: "Conor"
    },    
    {
      name: "Mark"
    },
  ]
  constructor(public firebase: FirebaseService, public firestore: AngularFirestore, public dialog: MatDialog) { }


  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(EditProfileComponent, {
      height: '500px',
      width: '600px',
    });
  }

}
