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

  constructor( private firebase: FirebaseService ) { }

  ngOnInit(): void {
    this.firebase.currentLoggedInEmail.subscribe(email => this.email = email)
  }

  login() {
    if (this.email == '' || this.password == '') {
      alert("Please enter valid data into both fields")
      return;
    }
    console.log(this.email, this.password);
    
    this.firebase.login(this.email, this.password);
    this.firebase.setEmail(this.email)
    this.email, this.password = '';
  }
}
