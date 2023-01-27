import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn: boolean = false;
  private loggedInEmail = new BehaviorSubject('');
  currentLoggedInEmail = this.loggedInEmail.asObservable();
  constructor(public firebaseAuth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) { }

  async register(email: string, password: string) {
    await this.firebaseAuth.createUserWithEmailAndPassword (email, password)
    .then((res) => 
    {
      this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(res.user));
      this.router.navigate(['/home'])
    })
  }

  async login(email: string, password: string) {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
    .then((res) => 
    {
      this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(res.user));
      this.router.navigate(['/home'])
    })
  }

  logout() {
    this.firebaseAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/'])
    }, err => {
      alert(err.message);
    })
  }

  setEmail(email: string) {
    this.loggedInEmail.next(email)
    }
}
