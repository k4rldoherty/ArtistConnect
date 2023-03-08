import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from '@angular/material/dialog';
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
  desc: string;
  source: string;

  selectedOption = 'song';
  constructor(private fstore: AngularFirestore, private afAuth: AngularFireAuth, private dialogRef: MatDialogRef<CreatePostComponent>) {
    this.artist = '';
    this.songName = '';
    this.songUrl = '';
    this.eventName = '';
    this.eventUrl = '';
    this.desc = '';
    this.source = '';
    }

  ngOnInit(): void {

  }

  onPost() {
    let ts = firebase.firestore.FieldValue.serverTimestamp();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        if (this.selectedOption == 'song'){
<<<<<<< HEAD
          if (this.songUrl.includes('spotify.com')){
            var source =  "Spotify"
          }
          else if (this.songUrl.includes('soundcloud.com')) {
            source = "Soundcloud"
          }
          else{
            source = 'unknown'
          }
          console.log(user.uid, this.songName, this.artist, this.songUrl);
=======
>>>>>>> 34d3c72 (Following / Follower working)
          this.fstore.collection('posts').add({
            timestamp: ts,
            type: this.selectedOption,
            uid: user.uid,
            songName: this.songName,
            artist: this.artist,
            songUrl: this.songUrl,
            desc: this.desc,
            source: source
          });
        }
        else {
          this.fstore.collection('posts').add({
            timestamp: ts,
            type: this.selectedOption,
            uid: user.uid,
            eventName: this.eventName,
            eventUrl: this.eventUrl,
          });
        }
      }
    });

    this.dialogRef.close();
  }
}
