import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  isUserFollowed: boolean = false;
  user$!: Observable<any>;
  feedPosts: PostData[] = [];
  testFollowers = [{ name: "Jimmy" }, { name: "Yury" }, { name: "Conor" }, { name: "Mark" }]
  testFollowing = [{ name: "Jimmy" }, { name: "Yury" }, { name: "Conor" }, { name: "Mark" }]
  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, private firebase: FirebaseService, private auth: AngularFireAuth) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid');
    this.user$ = this.firestore.doc(`users/${this.uid}`).valueChanges();
    this.isFollowing();
    this.getPosts(this.uid);
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
      });
  }

  follow() {
    this.firebase.follow(this.firebase.userData.uid, this.uid);
    this.isUserFollowed = true;
  }

  unFollow() {
    this.firebase.unfollow(this.firebase.userData.uid, this.uid);
    this.isUserFollowed = false;
  }

  isFollowing() {
    const user = this.firebase.userData.uid;
    let followingRef = this.firestore.doc(`users/${user.uid}/following/${this.uid}`);

    if(followingRef) {
      return this.isUserFollowed = true;
    }
    return this.isUserFollowed = false;
  }

}
