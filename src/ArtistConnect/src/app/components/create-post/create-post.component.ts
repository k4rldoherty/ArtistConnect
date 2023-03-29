import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
//
import firebase from 'firebase/compat/app';
import { MatOptionSelectionChange } from '@angular/material/core';

interface tmEvent{
  id : string,
  name : string
}


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
  tmSearch!: string;
  tmResults!: tmEvent[];
  

  selectedOption = 'song';
  organiser = '';
  constructor(private fstore: AngularFirestore, private afAuth: AngularFireAuth, private dialogRef: MatDialogRef<CreatePostComponent>, 
    private http: HttpClient) {
    this.artist = '';
    this.songName = '';
    this.songUrl = '';
    this.eventName = '';
    this.eventUrl = '';
    this.desc = '';
    this.source = '';
    this.tmSearch = '';
    }
  //npm install @agm/core --legacy-peer-deps 
  //AIzaSyCkzjjQv5IUTC0yz1HTYDtP8KFvx2xuWwM
  ngOnInit(){}

  onTmSearch(){
    const keyword = this.tmSearch.replace(/\s/g, "%20");
    this.http.get(`https://app.ticketmaster.com/discovery/v2/events?apikey=qtjQbp4GkppxptLA4y1LUmBG0tRAE4IH&keyword=${keyword}&locale=*`)
    .subscribe((data: any) => {
      this.tmResults = [];
      for (const event of data._embedded.events){
        const item: tmEvent = {id : event.id, name :  event.name};
      this.tmResults.push(item)
        }
      console.log(this.tmResults);
    })
    
  }

  onPost() {
    let ts = firebase.firestore.FieldValue.serverTimestamp();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        if (this.selectedOption == 'song'){
          if (this.songUrl.includes('spotify.com')){
            var source =  "Spotify"
          }
          else if (this.songUrl.includes('soundcloud.com')) {
            source = "Soundcloud"
          }
          else{
            source = 'unknown'
          }
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
