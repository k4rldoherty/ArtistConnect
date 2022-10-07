import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  email!: string;
  password!: string;
  username!: string;

  constructor( private firebase: FirebaseService ) { }

  ngOnInit(): void {
  }

  register() {
    if (this.email == '' || this.password == '') {
      alert("Please enter valid data into both fields")
      return;
    }
    console.log(this.email, this.password);
    
    this.firebase.register(this.email, this.password);
    this.email, this.password = '';
  }
}
