import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  isLoggedIn: boolean = false;
  constructor(public firebaseAuth: AngularFireAuth, private router: Router) { }
  
  register(email: string, password: string) {
    this.firebaseAuth.createUserWithEmailAndPassword(email, password).then(() => {
      this.router.navigate(['/login/'])
    }, err => {
      alert(err.message);
      this.router.navigate(['/login'])
    })
  }

  login(email: string, password: string) {
    this.firebaseAuth.signInWithEmailAndPassword(email, password).then(() => {
      localStorage.setItem('token', 'true');
      if(localStorage.getItem('token')){
        this.router.navigate(['/home']);
      }
    }, err => {
      alert(err.message);
      this.router.navigate(['/register'])
    })
  }

  logout() {
    this.firebaseAuth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login/'])
    }, err => {
      alert(err.message);
      this.router.navigate(['/login/'])
    })
  }
}
