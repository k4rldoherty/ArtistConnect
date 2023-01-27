import { Component, OnInit } from '@angular/core';
import { normalUser } from 'src/app/models/users';
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
    displayName: '',
    dob: '',
    country: '',
    county: ''
  }

  constructor( public firebase: FirebaseService, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.usersCollection = this.firestore.collection('users');
  }

  register() {
    if (this.newUserData.email == '' || this.password == '') {
      alert("Please enter valid data into both fields")
      return;
    }
    // this.firebase.passAdditionalUserData(this.newUserData.displayName, this.newUserData.dob, this.newUserData.county, this.newUserData.country);
    this.firebase.register(this.newUserData.email, this.password, this.newUserData.displayName, this.newUserData.dob, this.newUserData.country, this.newUserData.county);
  }
} 
