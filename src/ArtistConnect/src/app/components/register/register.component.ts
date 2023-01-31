import { Component, OnInit } from '@angular/core';
import { normalUser } from 'src/app/models/users';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable, map, Timestamp } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  password!: string;
  newUserData: normalUser = {
    email: '',
    displayName: '',
    dob: '',
    country: '',
    county: ''
  }

  constructor( public firebase: FirebaseService) { }

  ngOnInit(): void {
  }

  register() {
    if (this.newUserData.email == '' || this.password == '' || this.newUserData.country == '' || this.newUserData.county == '' || this.newUserData.displayName == '') {
      alert("Please enter valid data into all fields to successfully complete profile registration")
      return;
    }
    this.firebase.register(this.newUserData.email, this.password, this.newUserData.displayName, this.newUserData.dob, this.newUserData.country, this.newUserData.county);
  }
}