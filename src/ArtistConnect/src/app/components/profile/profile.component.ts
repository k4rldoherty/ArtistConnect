import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { normalUser } from 'src/app/models/users';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  signedInUserData: any = {}
  constructor(public firebase: FirebaseService, public firestore: AngularFirestore) { }

  ngOnInit(): void {
  }

}