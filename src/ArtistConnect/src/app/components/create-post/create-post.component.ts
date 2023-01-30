import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
//
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit{
  artist: string;
  songName: string;
  songUrl: string;
  eventName: string;
  eventUrl: string;

  selectedOption = 'song';
  constructor(private fstore: AngularFirestore, private afAuth: AngularFireAuth) {
    this.artist = '';
    this.songName = '';
    this.songUrl = '';
    this.eventName = '';
    this.eventUrl = '';
    }

  ngOnInit(): void {

  }

  onPost() {
    let ts = firebase.firestore.FieldValue.serverTimestamp();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        if (this.selectedOption == 'song'){
          console.log(user.uid, this.songName, this.artist, this.songUrl);
          this.fstore.collection('posts').add({
            timestamp: ts,
            type: this.selectedOption,
            uid: user.uid,
            songName: this.songName,
            artist: this.artist,
            songUrl: this.songUrl
          });
        }
        else {
          console.log(user.uid, this.eventName, this.eventUrl);
          this.fstore.collection('posts').add({
            timestamp: ts,
            type: this.selectedOption,
            uid: user.uid,
            eventName: this.eventName,
            eventUrl: this.eventUrl
          });
        }
      }
    });
  }
}
