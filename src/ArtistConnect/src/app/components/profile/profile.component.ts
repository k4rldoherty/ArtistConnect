import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { PostData } from '../home/home.component';
import { map, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  imageUrl!: string;
  downloadURL!: Observable<string>;
  feedPosts: PostData[] = [];
  posts: number = 0;
  followers: number = 0;
  following: number = 0;
  uid!: string;

  constructor(
    public firebase: FirebaseService, 
    public firestore: AngularFirestore, 
    public dialog: MatDialog, 
    public auth: AngularFireAuth, 
    public storage: AngularFireStorage, 
    public router: Router 
  ) { }

  ngOnInit(): void {
    this.onReload();
  }

  // Reload profile data when the component initializes or user logs in/out
  onReload() {
    this.auth.authState.subscribe((user) => {
      if (user) { // If user is logged in
        this.uid = user.uid;
        this.getPosts(this.uid); // Get the posts created by the user
        this.firebase.getFollowersCount(this.uid).subscribe((followers) => { // Get the number of followers of the user
          this.followers = followers;
        });
        this.firebase.getFollowingCount(this.uid).subscribe((following) => { // Get the number of users the user is following
          this.following = following;
        });
      }
    });
  }

  // Get the posts created by the user
  getPosts(uid: string) {
    this.firestore.collection('posts', ref => ref
      .where('uid', '==', uid) // Get the posts with the user's UID
      .orderBy('timestamp', 'desc') // Order the posts by timestamp in descending order
    )
      .snapshotChanges()
      .pipe(
        map((actions) => actions.map(a => {
          const data = a.payload.doc.data() as PostData;
          const did = a.payload.doc.id;
          return { ...data, did }; // Spread the post data and add the document ID as 'did' property
        }))
      )
      .subscribe(postsData => {
        this.feedPosts = postsData; // Set the array of posts
        this.posts = this.feedPosts.length; // Set the number of posts
      });
  }

  // Open the EditProfileComponent in a dialog
  openDialog() {
    this.dialog.open(EditProfileComponent, {
      height: '37.5em',
      width: '34.375em',
    });
  }
}
