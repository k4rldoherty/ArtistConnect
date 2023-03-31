import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FirebaseService } from '../../services/firebase.service'
import { map, Observable } from 'rxjs';
import { Message } from 'src/app/models/messenger';



@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

  messages$: any;
  value = '';
  conversationID = this.router.url.split('/')[2];
  loggedInuserMessages!: any[];
  otherUserMessages!: any[];

  constructor(private route: ActivatedRoute, private router: Router, private firestore: AngularFirestore, public firebase: FirebaseService) { }

  ngOnInit(): void {
    this.firebase.getMessages(this.conversationID).subscribe((messages) => {
      this.messages$ = messages;
      console.log(this.messages$);
    });
    
  }

  sendMessage() {
    console.log(this.value);
    const newMessage = {
      content: this.value,
      senderID: this.firebase.userData.uid
    }
    this.firestore.collection(`conversations/${this.conversationID}/messages`).add(newMessage);
    const conversationRef = this.firestore.collection(`conversations`).doc(this.conversationID);
    conversationRef.update({
      lastMessage: this.value
    })
    this.value = '';
  }
}
