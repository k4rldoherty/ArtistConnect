import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

interface Comment {
  userId: string;
  timestamp: any;
  input: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './comments-view.component.html',
  styleUrls: ['./comments-view.component.scss']
})
export class CommentsViewComponent implements OnInit {
  commentInput: string;
  commentsCollection: AngularFirestoreCollection<Comment>;
  comments: Observable<Comment[]>;
  userID: any;

  constructor(private firestore: AngularFirestore, @Inject(MAT_DIALOG_DATA) public data: any, private afAuth: AngularFireAuth) {
    this.commentInput = '';
    this.commentsCollection = this.firestore.collection<Comment>(`posts/${this.data.postID}/comments`);
    this.comments = this.commentsCollection.valueChanges({ idField: 'id' });
  }

  ngOnInit(): void {
  }

  addComment() {
    let ts = firebase.firestore.FieldValue.serverTimestamp();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const comment: Comment = {
          userId: user.uid, 
          timestamp: ts,
          input: this.commentInput
        };
        this.commentsCollection.add(comment);
        this.commentInput = '';
      }
    });
  }
}
