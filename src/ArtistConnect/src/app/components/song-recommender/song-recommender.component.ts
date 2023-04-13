import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';

@Component({
  selector: 'app-song-recommender',
  templateUrl: './song-recommender.component.html',
  styleUrls: ['./song-recommender.component.scss']
})
export class SongRecommenderComponent implements OnInit {
  @Input() trackId: string = '';
  @Input() energy: number = 0;
  @Input() speechiness: number = 0;
  @Input() instrumentalness: number = 0;
  recommendedSongs: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  
  async onGenerateRecommendations() {
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

    let authtoken = response.data.access_token;
    const url = 'https://api.spotify.com/v1/recommendations';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authtoken}`
    };
    const params = {
      seed_tracks: this.trackId,
      energy: this.energy,
      speechiness: this.speechiness,
      instrumentalness: this.instrumentalness
    };

    this.http.get<any>(url, { headers, params }).subscribe(data => {
      this.recommendedSongs = data.tracks;
    });
  }

  onPlaySong(songId: string) {
    // Logic to play the song with the given songId
    // (You can implement this logic based on your project requirements)
  }
}

