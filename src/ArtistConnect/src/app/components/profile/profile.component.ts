import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { normalUser } from 'src/app/models/users';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { PostData } from '../home/home.component';
import { map } from 'rxjs';

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
  feedPosts: PostData [] = []
  constructor(public firebase: FirebaseService, public firestore: AngularFirestore, public dialog: MatDialog) { }


  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(){
    this.firestore.collection('posts', ref => ref
    .limit(10),
    )
    .snapshotChanges()
    .pipe(
     map((actions) => actions.map(a => {
      const data = a.payload.doc.data() as PostData;
      const did = a.payload.doc.id;
      return { ...data, did };
    }))
  )
  .subscribe(postsData => {
    this.feedPosts = postsData;
  });
  }

  openDialog() {
    this.dialog.open(EditProfileComponent, {
      height: '500px',
      width: '600px',
    });
  }

}
