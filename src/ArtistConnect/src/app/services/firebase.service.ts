import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { normalUser } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn: boolean = false;
  userData: any;
  additionalUserData: any = {
    displayName: '',
    dob: '',
    country: '',
    county: ''
  }
  
  constructor(
    public firebaseAuth: AngularFireAuth, 
    private firestore: AngularFirestore, 
    private router: Router
    ) {
      this.firebaseAuth.authState.subscribe((user) => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user')!);
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
      console.log(result);
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
    const userData: normalUser = {
      uid: user.uid,
      email: user.email,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  get isUserLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  // passAdditionalUserData(displayName: any, dob: any, country: any, county: any) {
  //   this.additionalUserData.displayName = displayName
  //   this.additionalUserData.dob = dob
  //   this.additionalUserData.country = country
  //   this.additionalUserData.county = county
  // }
}
