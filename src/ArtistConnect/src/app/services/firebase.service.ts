import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { concatMap, finalize, from, Observable, of } from 'rxjs';
import { normalUser } from '../models/users';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn: boolean = false;
  userData: any;
  users!: any[];
  downloadURL: any;
  imageURL!: string;


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

  // get isUserLoggedIn(): boolean {
  //   const user = JSON.parse(localStorage.getItem('user')!);
  //   return user !== null && user.emailVerified !== false ? true : false;
  // }

  getUser(currentUserUid: string) {
    return this.firestore.doc(`users/${currentUserUid}`).valueChanges();
  }


  // uploadProfilePicture(image: File, path: string) {
  //   const storageRef = this.storage.ref(path)
  //   const task = this.storage.upload(path, image)
  //   const uploadPercent = task.percentageChanges();
  //   task.snapshotChanges().pipe(
  //     finalize(() => this.downloadURL = storageRef.getDownloadURL())
  //   ).subscribe();
  // }

  // getDownloadURL(path: string): Observable<string> {
  //   let ref = this.storage.ref(path);
  //   return new Observable<string>(observer => {
  //     ref.getDownloadURL().then(url => {
  //       observer.next(url);
  //       observer.complete();
  //     }, (error: any) => {
  //       observer.error(error);
  //     });
  //   });
  // }
}

