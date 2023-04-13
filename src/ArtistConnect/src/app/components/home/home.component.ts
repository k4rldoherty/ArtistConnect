import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog } from '@angular/material/dialog'
import { CreatePostComponent } from '../create-post/create-post.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface PostData {
  uid : string
  songName: string
  artist: string
  songUrl: string
  type: string
  eventName: string
  eventUrl: string
  timestamp: string
  did : string
  desc: string
  source: string
  eventDetails: any
  organiser: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user = localStorage.getItem('user');
  feedPosts: PostData [] = [];
  constructor(public firebase: FirebaseService, private dialog: MatDialog, private firestore: AngularFirestore) { }
  
  ngOnInit(): void {
    this.getPosts();
  }


  logout() {
    this.firebase.logout()
  }

  createPostClick(){
    this.dialog.open( CreatePostComponent );
  }


  getPosts(){
    let userIds: any[] = [];
    let id = this.firebase.userData.uid;
    this.firestore.collection('users', (ref) => ref.where('uid', '!=', id)).valueChanges()
      .pipe(
        map((users) => users.map((user: any) => user.uid))
      ).subscribe((uids) => {
        this.firestore.collection('posts', ref => ref
        .where('uid', 'in', uids)
        .orderBy('timestamp', 'desc')
        )
        .snapshotChanges()
        .pipe(
         map(actions => actions.map(a => {
          const data = a.payload.doc.data() as PostData;
          const did = a.payload.doc.id;
          return { ...data, did };
        }))
      )
      .subscribe(postsData => {
        this.feedPosts = postsData;
      });
    });

    console.log(userIds);
  }

}
