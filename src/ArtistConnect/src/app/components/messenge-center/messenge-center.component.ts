import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-messenge-center',
  templateUrl: './messenge-center.component.html',
  styleUrls: ['./messenge-center.component.scss']
})
export class MessengeCenterComponent implements OnInit {

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, public firebase: FirebaseService) { }

  ngOnInit(): void {
  }

}
