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
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  user = localStorage.getItem('user');
  searchMode: boolean = false;
  feedPosts: PostData[] = [];
  searchResultsPosts: PostData[] = [];
  searchResultsUsers: normalUser[] = [];
  constructor(public firebase: FirebaseService, private dialog: MatDialog, private firestore: AngularFirestore, public auth: AngularFireAuth) {
    this.firebase.searchPressed$.subscribe(value => {
      this.searchMode = value;
    });
    this.firebase.searchValue$.subscribe((value: string) => {
      this.firebase.getFilteredSearchResultsUser(value).subscribe((searchResultsUsers: any) => {
        this.searchResultsUsers = searchResultsUsers;
      });
      this.firebase.getFilteredSearchResultsPost(value).subscribe((searchResultsPosts: any) => {
        this.searchResultsPosts = searchResultsPosts;
      });
    })
  }

  ngOnInit(): void {
    this.auth.authState.subscribe((user: any) => {
      if (user) {
        this.user = user.uid;
        this.getPosts();
      }
    })
  }


  logout() {
    this.firebase.logout()
  }

  createPostClick() {
    this.dialog.open(CreatePostComponent);
  }


  getPosts() {
    let id = this.firebase.userData.uid;
    this.firestore.collection('users', (ref) => ref.where('uid', '!=', id)).valueChanges()
      .pipe(
        map((users) => users.map((user: any) => user.uid)),
        take(1)
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
        take(1)
      )
      .subscribe(postsData => {
        this.feedPosts = postsData;
      });
    });
  }

}
