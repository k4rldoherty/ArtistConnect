import { Component, OnInit } from '@angular/core';
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
    name : string,
    venue : string,
    city : string,
    country : string,
    lat : string,
    long : string,
    time : string,
    date : string,
    url : string,
    image: string
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
  tmSelection!: tmEvent;
  

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
        const item: tmEvent = {
          id : event.id,
          name :  event.name,
          url : event.url,
          venue : event._embedded.venues[0].name,
          city : event._embedded.venues[0].city.name,
          country : event._embedded.venues[0].country.name,
          lat : event._embedded.venues[0].location.latitude,
          long : event._embedded.venues[0].location.longitude,
          time : event.dates.start.localTime,
          date : event.dates.start.localDate,
          image : event.images[6].url
          };
        this.tmResults.push(item)
        }
      console.log(this.tmResults);
    })
  }

  onTmEventSelection(selection: tmEvent){
    this.tmSelection = selection;
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
        else if (this.selectedOption == 'event') {
          if (this.organiser = 'tm'){
            this.fstore.collection('posts').add({
              timestamp: ts,
              type: this.selectedOption,
              uid: user.uid,
              organiser : 'Ticketmaster',
              desc: this.desc,
              eventDetails : this.tmSelection
              //When option is selected on search, I would like to add the entire object 
            });
          }
        }
      }
    });

    this.dialogRef.close();
  }
}
