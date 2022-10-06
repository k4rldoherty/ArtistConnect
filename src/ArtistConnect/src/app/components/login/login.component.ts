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
  }

  login() {
    if (this.email == '' || this.password == '') {
      alert("Please enter valid data into both fields")
      return;
    }
    console.log(this.email, this.password);
    
    // this.firebase.login(this.email, this.password);
    this.email, this.password = '';
  }
}
