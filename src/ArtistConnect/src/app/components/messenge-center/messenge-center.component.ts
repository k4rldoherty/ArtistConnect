import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable, forkJoin, map, mergeMap, shareReplay, switchMap } from 'rxjs';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-messenge-center',
  templateUrl: './messenge-center.component.html',
  styleUrls: ['./messenge-center.component.scss']
})
export class MessengeCenterComponent implements OnInit {
  
  conversations$!: Observable<any[]>;
  conversationsIDs$!: Observable<string[]>

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, public firebase: FirebaseService) { }

  ngOnInit(): void {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.conversations$ = this.getConversations(user.uid);
      }
    });
  }

  getConversations(uid: string): Observable<any[]> {
    // get list of conversation id from users/uid/conversations
    const userDocRef = this.firestore.collection('users').doc(uid);
    const conversationsIDs$ = userDocRef.get().pipe(
      map((doc: any) => doc.data().conversations),
      shareReplay(1) // cache the result to prevent multiple requests
    );

    // display conversations that match the elements in the list
    const conversationsCollection$ = conversationsIDs$.pipe(
      switchMap(conversationsIDs => {
        // retrieve conversations collection
        const conversationsCollection: AngularFirestoreCollection<any> = this.firestore.collection('conversations', ref => {
          return ref.where(firebase.firestore.FieldPath.documentId(), 'in', conversationsIDs);
        });

        // retrieve conversations data
        return conversationsCollection.snapshotChanges().pipe(
          mergeMap(actions => {
            // for each conversation, retrieve the corresponding user data
            const conversations = actions.map((a: any) => {
              const conversationData = a.payload.doc.data();
              const otherUserId = conversationData.user1 === uid ? conversationData.user2 : conversationData.user1;
              const userDocRef = this.firestore.collection('users').doc(otherUserId);

              // map conversation data to an object with the other user's display name
              return userDocRef.get().pipe(
                map((doc: any) => ({
                  id: a.payload.doc.id,
                  lastMessage: conversationData.lastMessage,
                  displayName: doc.data().displayName,
                }))
              );
            });

            // combine all observables into one array
            return forkJoin(conversations);
          })
        );
      })
    );

    // also return the conversationsCollection$ observable for any other use
    return conversationsCollection$;
  }

}
