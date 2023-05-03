import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from '../../services/firebase.service'
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
  @ViewChild('scroll', { static: true }) scroll: any;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private firestore: AngularFirestore,
    public firebase: FirebaseService,
  ) { }

  ngOnInit(): void {
    this.firebase.getMessages(this.conversationID).subscribe((messages: Message[]) => {
      this.messages$ = messages;
    });
  }

  ngAfterViewInit() {
    this.scroll.nativeElement.scrollTo(0, this.scroll.nativeElement.scrollHeight);
  }

  sendMessage() {
    if (this.value == '') {
      alert("Please enter a value")
    } else {
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
      setTimeout(() => {
        this.scroll.nativeElement.scrollTo(0, this.scroll.nativeElement.scrollHeight);
      }, 0);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 13) { // Enter key
      this.sendMessage();
    }
  }
}
