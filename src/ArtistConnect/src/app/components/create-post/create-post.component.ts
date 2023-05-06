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
import axios from 'axios';

interface acEvent {
  id: string,
  name: string,
  venue: string,
  city: string,
  country: string,
  lat: string,
  long: string,
  time: string,
  date: string,
  url: string,
  image: string,
}

interface spotifySong {
  id: string
  name: string,
  artist: string,
  url: string,
  image: string
}

interface spotifySong {
  id: string
  name: string,
  artist: string,
  url: string,
  image: string
}


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  artist!: string;
  songName!: string;
  songUrl!: string;

  eventName!: string;
  eventUrl!: string;
  eventVenue!: string;
  eventCity!: string;
  eventCountry!: string;
  eventTime!: string;
  eventDate!: string;


  source!: string;
  tmSearch!: string;
  tmResults!: acEvent[];
  tmSelection!: acEvent;
  ebSearch!: string;
  ebId!: string;
  ebEvent!: acEvent;
  spSearch!: string;
  spResults!: spotifySong[];


  desc!: string;
  selectedOption = 'song';
  organiser = '';
  platform = '';
  spSelection!: spotifySong;

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

  ngOnInit() { }

  onTmSearch() {
    const keyword = this.tmSearch.replace(/\s/g, "%20");
    this.http.get(`https://app.ticketmaster.com/discovery/v2/events?apikey=qtjQbp4GkppxptLA4y1LUmBG0tRAE4IH&keyword=${keyword}&locale=*`)
      .subscribe((data: any) => {
        this.tmResults = [];
        for (const event of data._embedded.events) {
          // const date = event.dates.start.localDate;
          // const dateParts = date.split("-");
          // const dateFormatted = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          let time = event.dates.start.localTime;
          if (time) {
            const timeParts = time.split(":");
            time = `${timeParts[0]}:${timeParts[1]}`
          };
          const item: acEvent = {
            id: event.id,
            name: event.name,
            url: event.url,
            venue: event._embedded.venues[0].name,
            city: event._embedded.venues[0].city.name,
            country: event._embedded.venues[0].country.name,
            lat: event._embedded.venues[0].location.latitude,
            long: event._embedded.venues[0].location.longitude,
            time: time,
            date: event.dates.start.localDate,
            image: event.images[6].url
          };
          this.tmResults.push(item)
        }
      })
  }
  //MKAX6LVE5RUGQTXLYORX
  getEbEvent() {
    let url = this.ebSearch;
    const regex = /tickets-(\d+)/;
    const match = url.match(regex);

    if (match) {
      const longNumberString = match[1];
      this.ebId = longNumberString
      this.ebSearch = '';
    } else {
      alert("URL is not valid");
    }

    this.http.get(`https://www.eventbriteapi.com/v3/events/${this.ebId}/?expand=venue`, {
      headers: {
        'Authorization': 'Bearer MKAX6LVE5RUGQTXLYORX',
      }
    }).subscribe((data: any) => {
      let start = data.start.local.split('T');
      let date = start[0];
      let time = start[1];
      this.ebEvent = {
        id: this.ebId,
        name: data.name.text,
        url: data.url,
        venue: data.venue.name,
        city: data.venue.address.city,
        country: data.venue.address.country,
        lat: data.venue.address.latitude,
        long: data.venue.address.longitude,
        time: time,
        date: date,
        image: data.logo.url
      }
    });
  }

  async onSpSearch() {
    this.spResults = [];
    const base64 = (value: string) => {
      return btoa(value);
    }
    //Generates OAuth token for api
    const auth = base64('b6ccc6a683614eb49896a4fa30ed0815:a04caf9a809e49178a70755e84e29c4f');
    const response = await axios.post("https://accounts.spotify.com/api/token", "grant_type=client_credentials", {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const formattedQuery = this.spSearch.replace(/\s/g, '%20');
    let authtoken = response.data.access_token;
    this.http.get(`https://api.spotify.com/v1/search?q=${formattedQuery}&type=track&limit=10`, {
      headers: {
        Authorization: `Bearer ${authtoken}`
      }
    }).subscribe((data: any) => {
      const tracks = data.tracks.items;
      const songTitles = tracks.map((track: any) => track.name);
      this.spResults = [];
      for (const track of data.tracks.items) {
        const item: spotifySong = {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          url: track.external_urls.spotify,
          image: track.album.images[0].url,
        };
        this.spResults.push(item);
      }
    });
  }
  onSpotifySelection(selection: spotifySong) {
    this.spSelection = selection;
  }

  onTmEventSelection(selection: acEvent) {
    this.tmSelection = selection;
  }

  onPost() {
    let ts = firebase.firestore.FieldValue.serverTimestamp();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        let image = '';
        let id = '';
        if (this.selectedOption == 'song') {
          if (this.platform == 'spotify') {
            this.songName = this.spSelection.name;
            this.artist = this.spSelection.artist;
            this.songUrl = this.spSelection.url;
            image = this.spSelection.image
            id = this.spSelection.id
            var source = "Spotify"
          }
          else {
            source = 'unknown'
          }
          this.fstore.collection('posts').add({
            id: id,
            image: image,
            timestamp: ts,
            type: this.selectedOption,
            uid: user.uid,
            songName: this.songName,
            artist: this.artist,
            songUrl: this.songUrl,
            desc: this.desc,
            source: source,
            searchTerms: [
              ...this.songName.toLowerCase().split(' '),
              ...this.artist.toLowerCase().split(' '),
              ...this.desc.toLowerCase().split(' '),
            ]
          });
        }
        else if (this.selectedOption == 'event') {
          let organiser = '';
          let eventDetails = this.tmSelection
          if (this.organiser == 'tm') {
            organiser = 'Ticketmaster';
            eventDetails = this.tmSelection
          }
          else if (this.organiser == 'eb') {
            organiser = 'Eventbrite';
            eventDetails = this.ebEvent
          }
          else {
            organiser = 'Other';
            eventDetails = {
              id: '',
              name: this.eventName,
              url: this.eventUrl,
              venue: this.eventVenue,
              city: this.eventCity,
              country: this.eventCountry,
              time: this.eventTime,
              date: this.eventDate,
              lat: '',
              long: '',
              image: ''
            }
          }
          this.fstore.collection('posts').add({
            timestamp: ts,
            type: this.selectedOption,
            uid: user.uid,
            organiser: organiser,
            desc: this.desc,
            eventDetails: eventDetails,
            searchTerms: [
              ...this.organiser.toLowerCase().split(' '),
              ...this.desc.toLowerCase().split(' '),
              ...this.selectedOption.toLowerCase().split(' ')
          ]
          });
        }
      }
    });

    this.dialogRef.close();
  }
}
