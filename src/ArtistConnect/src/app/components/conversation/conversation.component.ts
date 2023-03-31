import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FirebaseService } from '../../services/firebase.service'
import { map, Observable } from 'rxjs';
import { Message } from 'src/app/models/messenger';
import firebase from 'firebase/compat/app';



@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

  messages$: any;
  value = '';
  conversationID = this.router.url.split('/')[2];
  user1: string = this.router.url.split('/')[2].split('_')[0]
  user2: string = this.router.url.split('/')[2].split('_')[1]

  constructor(private route: ActivatedRoute, public router: Router, private firestore: AngularFirestore, public firebase: FirebaseService) { }

  ngOnInit(): void {
    this.firebase.getMessages(this.conversationID).subscribe((messages: Message[]) => {
      this.messages$ = messages;
    });
  }

  sendMessage() {
    console.log(this.value);
    const newMessage = {
      content: this.value,
      senderId: this.firebase.userData.uid,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp()
    }
    this.firestore.collection(`conversations/${this.conversationID}/messages`).add(newMessage);
    const conversationRef = this.firestore.collection(`conversations`).doc(this.conversationID);
    conversationRef.update({
      lastMessage: this.value
    })
    this.value = '';
    this.firebase.getMessages(this.conversationID).subscribe((messages: Message[]) => {
      this.messages$ = messages;
    });
  }
}
