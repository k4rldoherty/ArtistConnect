import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PostData } from '../../components/home/home.component';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  uid: any = '';
  user$!: Observable<any>;
  feedPosts: PostData[] = [];
  isFollowing!: boolean;
  testFollowers = [{ name: "Jimmy" }, { name: "Yury" }, { name: "Conor" }, { name: "Mark" }]
  testFollowing = [{ name: "Jimmy" }, { name: "Yury" }, { name: "Conor" }, { name: "Mark" }]
  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, private firebase: FirebaseService) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid');
    this.user$ = this.firestore.doc(`users/${this.uid}`).valueChanges();
    this.getPosts(this.uid);
    this.isUserFollowing();
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
  }

  isUserFollowing() {
      console.log(this.firestore.collection('users').doc(this.uid).collection('following').doc(this.firebase.userData.uid).get());
  }

}
