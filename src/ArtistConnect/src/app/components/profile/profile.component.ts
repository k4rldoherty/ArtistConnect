import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { PostData } from '../home/home.component';
import { finalize, map, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';

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


  constructor(public firebase: FirebaseService, public firestore: AngularFirestore, public dialog: MatDialog, public auth: AngularFireAuth, public storage: AngularFireStorage) {
  }

  ngOnInit(): void {
    this.getPosts(this.firebase.userData.uid);
    this.firebase.getFollowersCount(this.firebase.userData.uid).subscribe((followers) => {
      this.followers = followers;
    });
    this.firebase.getFollowingCount(this.firebase.userData.uid).subscribe((following) => {
      this.following = following;
    });
  }

  getPosts(uid: string) {
    this.firestore.collection('posts', ref => ref
      .where('uid', '==', uid)
      .orderBy('timestamp', 'desc')
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
        this.posts = this.feedPosts.length;
      });
  }

  openDialog() {
    this.dialog.open(EditProfileComponent, {
      height: '37.5em',
      width: '34.375em',
    });
  }
}


