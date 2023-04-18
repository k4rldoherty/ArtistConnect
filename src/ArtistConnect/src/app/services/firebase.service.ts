import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { map, Observable, Subject, switchMap } from 'rxjs';
import { normalUser } from '../models/users';
import { Message } from '../models/messenger';
import firebase from 'firebase/compat/app';
import { PostData } from '../components/home/home.component';


@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  isLoggedIn: boolean = false;
  userData: any;
  users!: any[];
  searchValue$ = new Subject<string>();
  searchPressed$ = new Subject<boolean>();

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

  async doesConversationExist(user1: string, user2: string): Promise<boolean> {
    const conversationId = `${user1}_${user2}`;
    const conversationIdReversed = `${user2}_${user1}`;
    const conversationRef = this.firestore.collection('conversations').doc(conversationId);
    const conversationRefReversed = this.firestore.collection('conversations').doc(conversationIdReversed);

    const doc = await conversationRef.get().toPromise();

    if (doc && doc.exists) {
      return true;
    } else {
      const reversedDoc = await conversationRefReversed.get().toPromise();
      if (reversedDoc && reversedDoc.exists) {
        return true;
      } else {
        return false;
      }
    }
  }

  createConversation(user1: string, user2: string) {
    const conversationId = `${user1}_${user2}`;
    const conversationRef = this.firestore.collection('conversations').doc(conversationId);
    const user1Ref = this.firestore.collection('users').doc(user1);
    const user2Ref = this.firestore.collection('users').doc(user2);

    const conversation = {
      user1: user1,
      user2: user2,
      lastMessage: "",
      unreadCount: 0
    };

    return conversationRef.get().toPromise()
      .then((doc: any) => {
        if (doc.exists) {
          // conversation already exists, navigate to existing conversation
          this.router.navigate([`/message-centre/${conversationId}`]);
          return;
        } else {
          // check the other conversation reference as well
          const conversationIdReversed = `${user2}_${user1}`;
          const conversationRefReversed = this.firestore.collection('conversations').doc(conversationIdReversed);
          return conversationRefReversed.get().toPromise()
            .then((doc: any) => {
              if (doc.exists) {
                // conversation already exists, navigate to existing conversation
                this.router.navigate([`/message-centre/${conversationIdReversed}`]);
                return;
              } else {
                // create new conversation
                return conversationRef.set(conversation)
                  .then(() => {
                    user1Ref.update({
                      conversations: firebase.firestore.FieldValue.arrayUnion(conversationId)
                    })
                    user2Ref.update({
                      conversations: firebase.firestore.FieldValue.arrayUnion(conversationId)
                    });
                    this.router.navigate([`/message-centre/${conversationId}`]);
                  });
              }
            });
        }
      });
  }


  isFollowingUser(followingUid: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.firebaseAuth.authState.subscribe(user => {
        if (user) {
          const uid = user.uid;
          const followingRef = this.firestore.collection(`users/${uid}/following`).doc(followingUid).ref;
          followingRef.get().then(followingData => {
            observer.next(followingData.exists); // return true if followingData exists
          })
            .catch(error => {
              alert('Error getting following data: ' + error);
              observer.next(false);
            });
        } else {
          observer.next(false);
        }
      });
    });
  }

  getMessages(conversationID: string) {
    const messageRef: AngularFirestoreCollection<Message> = this.firestore
      .collection(`conversations/${conversationID}/messages`, ref => ref.orderBy('timeStamp'));
    return messageRef.valueChanges({ idField: 'id' });
  }

  setSearchValue(searchValue: string) {
    this.searchValue$.next(searchValue);
  }

  getFilteredSearchResultsPost(searchValue: string): Observable<PostData[]> {
    console.log('getFilteredSearchResultsPost() called with searchValue:', searchValue);
    let id = this.userData.uid;
    return this.firestore.collection('users', (ref) => ref.where('uid', '!=', id)).valueChanges()
      .pipe(
        map((users) => users.map((user: any) => user.uid)),
        switchMap(() => {
          return this.firestore.collection('posts', ref => ref
            .where('desc', '>=', searchValue)
            .where('desc', '<=', searchValue + '\uf8ff')
            .orderBy('desc')
          )
            .snapshotChanges()
            .pipe(
              map(actions => {
                console.log('snapshotChanges() returned:', actions);
                return actions.map(a => {
                  const data = a.payload.doc.data() as PostData;
                  const did = a.payload.doc.id;
                  return { ...data, did };
                });
              })
            );
        })
      );
  }

  getFilteredSearchResultsUser(searchValue: string): Observable<normalUser[]> {
    return this.firestore.collection('users', ref => {
      return ref
        .orderBy('displayName')
        .startAt(searchValue)
        .endAt(searchValue + '\uf8ff')
    }).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as normalUser;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
}

