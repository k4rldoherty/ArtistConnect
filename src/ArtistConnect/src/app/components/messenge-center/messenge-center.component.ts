import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable } from 'rxjs';
import { Conversation } from 'src/app/models/messenger';

@Component({
  selector: 'app-messenge-center',
  templateUrl: './messenge-center.component.html',
  styleUrls: ['./messenge-center.component.scss']
})
export class MessengeCenterComponent implements OnInit {
  conversations$!: Observable<Conversation[]>;

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, public firebase: FirebaseService) { }

  ngOnInit(): void {
    const userId = this.firebase.userData.uid;
    this.conversations$ = this.firestore.collection<Conversation>('conversations', ref => {
      return ref.where('user1', '==', userId);
    }).valueChanges();
  }

  enterConversation(conversation: any) {
    console.log(conversation);
  }
}
