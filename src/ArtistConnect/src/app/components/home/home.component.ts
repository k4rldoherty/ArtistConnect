import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog } from '@angular/material/dialog'
import { CreatePostComponent } from '../create-post/create-post.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { normalUser } from 'src/app/models/users';

export interface PostData {
  uid: string
  songName: string
  artist: string
  songUrl: string
  type: string
  eventName: string
  eventUrl: string
  timestamp: string
  did: string
  desc: string
  source: string
  eventDetails: any
  organiser: string
  image: string
  id: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  user = localStorage.getItem('user');
  feedPosts: PostData[] = [];
  searchMode: boolean = false;
  currentFilter: string = 'all';
  constructor(public firebase: FirebaseService, private dialog: MatDialog, private firestore: AngularFirestore, public auth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.auth.authState.subscribe((user: any) => {
      if (user) {
        this.user = user.uid;
        this.getAllPosts();
      }
    })
  }


  logout() {
    this.firebase.logout()
  }

  createPostClick() {
    this.dialog.open(CreatePostComponent);
  }


  getAllPosts() {
    let id = this.firebase.userData.uid;
    this.firestore.collection('users', (ref) => ref.where('uid', '!=', id)).valueChanges()
      .pipe(
        map((users) => users.map((user: any) => user.uid)),
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
        })),
      )
      .subscribe(postsData => {
        this.feedPosts = postsData;
      });
    });
  }

  getPosts(filter: string) {
    let id = this.firebase.userData.uid;
    this.firestore.collection('users', (ref) => ref.where('uid', '!=', id)).valueChanges()
      .pipe(
        map((users) => users.map((user: any) => user.uid)),
        take(1)
      ).subscribe((uids) => {
        this.firestore.collection('posts', ref => ref
          .where('uid', 'in', uids)
          .where('type', '==', filter)
          .orderBy('timestamp', 'desc')
        )
        .snapshotChanges()
        .pipe(
         map(actions => actions.map(a => {
          const data = a.payload.doc.data() as PostData;
          const did = a.payload.doc.id;
          return { ...data, did };
        })),
        take(1)
      )
      .subscribe(postsData => {
        this.feedPosts = postsData;
      });
    });
  }

  changeFilter(type: string) {
    console.log(type);
    switch(type) {
      case 'songs': {
        this.currentFilter = 'songs';
        break;
      }
      case 'events': {
        this.currentFilter = 'events';
        break;
      }
      case 'all': {
        this.currentFilter = 'all';
        break;
      }
      default: {
        break;
      }
    }
  }

}
