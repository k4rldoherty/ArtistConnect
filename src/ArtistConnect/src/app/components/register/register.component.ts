import { Component, OnInit } from '@angular/core';
import { normalUser } from 'src/app/models/normal-user-profile';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  password!: string;
  usersCollection!: AngularFirestoreCollection<normalUser>;

  newUserData: normalUser = {
    email: '',
    username: '',
    dob: '',
    country: '',
    county: ''
  }

  constructor( private firebase: FirebaseService, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.usersCollection = this.firestore.collection('users');
  }



  register() {
    if (this.newUserData.email == '' || this.password == '') {
      alert("Please enter valid data into both fields")
      return;
    }
    console.log(this.newUserData);
    
    this.firebase.register(this.newUserData.email, this.password);
    this.firestore.collection('users').add({
      email: this.newUserData.email,
      username: this.newUserData.username,
      dob: this.newUserData.dob,
      county: this.newUserData.county,
      country: this.newUserData.country
    }).then(res => {
      console.log(res);
      this.newUserData = {
        email: '',
        username: '',
        dob: '',
        country: '',
        county: ''
      }
      this.password = '';
    })
  }
} 
