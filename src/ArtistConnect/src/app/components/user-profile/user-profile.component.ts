import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PostData } from '../../components/home/home.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  uid: any;
  user$!: Observable<any>;
  feedPosts: PostData[] = [];
  isFollowing!: boolean;
  following: number = 0;
  followers: number = 0;
  posts: number = 0;

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, private firebase: FirebaseService, private auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid');
    
    this.user$ = this.firestore.doc(`users/${this.uid}`).valueChanges();
    
    this.getPosts(this.uid);
    
    this.firebase.isFollowingUser(this.uid)
    .subscribe(isFollowing => {
      this.isFollowing = isFollowing;
    });

    this.firebase.getFollowersCount(this.uid).subscribe((followers) => {
      this.followers = followers;
      console.log(this.followers);
    });
    
    this.firebase.getFollowingCount(this.uid).subscribe((following) => {
      this.following = following;
      console.log(this.following);
    });
  }

  getPosts(uid: string) {
    this.firestore.collection('posts', ref => ref
      .where('uid', '==', uid)
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
        this.posts = this.feedPosts.length
      });
  }

  follow() {
    this.firebase.follow(this.firebase.userData.uid, this.uid);
    this.isFollowing = true;
    this.followers++;
  }

  unFollow() {
    this.firebase.unfollow(this.firebase.userData.uid, this.uid);
    this.isFollowing = false;
    this.followers--;
  }
  
  messageUser() {
    this.firebase.createConversation(this.firebase.userData.uid, this.uid);
  }

}
