import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/services/firebase.service';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

interface User {
  displayName: string;
}

@Component({
  selector: 'app-like-view',
  templateUrl: './like-view.component.html',
  styleUrls: ['./like-view.component.scss']
})
export class LikeViewComponent implements OnInit {
  likes: any[] = [];
  faHeart = faHeart;

  constructor(private firestore: AngularFirestore, public firebase: FirebaseService, @Inject(MAT_DIALOG_DATA) public data: any) {}

  async ngOnInit() {
    // Replace with the actual post ID
    const likesObservable = this.firestore.collection(`posts/${this.data.postID}/likes`).get();
    
    likesObservable.subscribe(likesSnapshot => {
      likesSnapshot.docs.forEach(doc => {
        this.firestore.collection('users').doc<User>(doc.id).get()
        .subscribe(user => {
          this.likes.push(user.data()?.displayName);
        });
      });
    });
  }
}
