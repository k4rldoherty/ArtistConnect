import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { normalUser } from '../models/users';


@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  isLoggedIn: boolean = false;
  userData: any;
  users!: any[];


  constructor(
    public firebaseAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    public storage: AngularFireStorage,
    private router: Router
  ) {

    this.firebaseAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);

        this.getUser(this.userData.uid).subscribe(user => {
          this.userData = user;
        });
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  getUser(currentUserUid: string) {
    return this.firestore.doc(`users/${currentUserUid}`).valueChanges();
  }

  register(email: string, password: string, displayName: any, dob: any, country: any, county: any) {
    return this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserDataRegister(result.user, displayName, dob, country, county);
        this.router.navigate(['home'])
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  login(email: string, password: string, displayName: any) {
    return this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserDataLogin(result.user);
        this.firebaseAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['home']);
            this.isLoggedIn = true;
          }
        });

      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  logout() {
    return this.firebaseAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['']);
      this.isLoggedIn = false;
    });
  }

  setUserDataRegister(user: any, displayName: any, dob: any, country: any, county: any) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
      `users/${user.uid}`
    );
    const userData: normalUser = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      dob: dob,
      county: county,
      country: country
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  setUserDataLogin(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
      `users/${user.uid}`
    );
    const userData: any = {
      uid: user.uid,
      email: user.email,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  getFollowersCount(userId: string) {
    // Used to build the follower count
    return this.firestore.collection(`users`).doc(userId).collection('followers').valueChanges().pipe(
      map((followers: any) => followers.length)
    );
  }

  getFollowingCount(userId: string) {
    // Used to build the follower count
    return this.firestore.collection(`users`).doc(userId).collection('following').valueChanges().pipe(
      map((following: any) => following.length)
    );
  }

  follow(followerId: string, followedId: string) {
    const followerRef = this.firestore.collection(`users`).doc(followerId);
    const followedRef = this.firestore.collection(`users`).doc(followedId);

    followerRef.collection('following').doc(followedId).set({ followed: true });
    followedRef.collection('followers').doc(followerId).set({ follower: true });
  }

  unfollow(followerId: string, followedId: string) {
    const followerRef = this.firestore.collection(`users`).doc(followerId);
    const followedRef = this.firestore.collection(`users`).doc(followedId);

    followerRef.collection('following').doc(followedId).delete();
    followedRef.collection('followers').doc(followerId).delete();
  }
}

