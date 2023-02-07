import { Component, OnInit, Output } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog } from '@angular/material/dialog'
import { CreatePostComponent } from '../create-post/create-post.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

export interface PostData {
  uid : string
  songName: string
  artist: string
  songUrl: string
  type: string
  eventName: string
  eventUrl: string
  timestamp: string
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
    console.log('create button clicked');
    this.dialog.open( CreatePostComponent );
  }


  getPosts(){
    this.firestore.collection('posts', ref => ref
    .limit(10),
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
  }

}
