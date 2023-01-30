import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email!: string;
  password!: string;
  isSignedIn: boolean = false;

  constructor( private firebase: FirebaseService ) { }

  ngOnInit(): void {
    if(localStorage.getItem('user') !== null) {
      this.isSignedIn = true;
    } else {
      this.isSignedIn = false;
    }
  }

  async login() {
    if (this.email == '' || this.password == '') {
      alert("Please enter valid data into both fields")
      return;
    }
    await this.firebase.login(this.email, this.password, "");
    if(this.firebase.isLoggedIn) {
      this.isSignedIn = true;
    }
    this.email, this.password = '';
  }
}
