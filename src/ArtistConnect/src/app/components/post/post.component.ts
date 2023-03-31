import { Component, Input, OnInit } from '@angular/core';
import { PostData } from '../home/home.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { map,take } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { IPlayerComponent } from '../i-player/i-player.component';
import { CommentsViewComponent } from '../comments-view/comments-view.component';
import { Router } from '@angular/router';



export interface UserData {
  displayName: string;
  country: string;
  county: string;
  dob: string;
  email: string;
  uid: string;
}


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() postData!: PostData;
  creator: any;
  artwork = '';
  date: any;
  count: any;
  authtoken: any;
  trackId: any;
  source: any;


  constructor(
    private firestore: AngularFirestore, 
    public firebase: FirebaseService,
    private fauth: AngularFireAuth,
    private http: HttpClient, 
    private functions: AngularFireFunctions,
    private dialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getName();
    this.getLikeCount();
    if (this.postData.source == 'Spotify'){
    this.getSpotifyArt();
    }
  }

  getName() {
    let userId = this.postData.uid;
    this.firebase.getUser(userId).subscribe(user => {
      this.creator = user;
    });
  }

  getLikeCount(){
    const postId = this.postData.did
    this.firestore
    .collection(`posts/${postId}/likes`)
    .valueChanges()
    .subscribe((querySnapshot) => {
    this.count = querySnapshot.length;
    });
  }

  getUrlSource(){

  }

  //Function pulls Track artwork from Spotify Api
  async getSpotifyArt() {
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
    // console.log(response);

    this.authtoken = response.data.access_token;
    this.http.get(`https://api.spotify.com/v1/tracks/${this.getTrackIdFromUrl(this.postData.songUrl)}`, {
      headers: {
        'Authorization': `Bearer ${this.authtoken}`,
      }
    }).subscribe((data: any) => {
      this.artwork = data.album.images[0].url;
      // console.log(this.artwork);
    });
  }

  getTrackIdFromUrl(url: string) {
    this.trackId = url.split('/').pop();
    return this.trackId;
  }

  //Function for when like button is clicked
  likePost(postId: string) {
    this.fauth.authState.subscribe(user => {
      if (user) {
        let likeRef = this.firestore.collection(`posts/${postId}/likes`).doc(user.uid);
        likeRef.snapshotChanges().pipe(
          take(1),
          map(action => {
            if (action.payload.exists) {
              likeRef.delete();
            } else {
              likeRef.set({});
            }
          })
        ).subscribe();
        this.getLikeCount;
      }
    });
  }

  //Function for 
  onPlayClick(){
    let source = this.postData.source;
    if (source == "Soundcloud") {
      window.open(this.postData.songUrl, "_blank");
    } 
    else if (source == "Spotify") {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        songUrl: this.postData.songUrl,
        token: this.authtoken,
        trackId: this.getTrackIdFromUrl(this.postData.songUrl)

      };
    
      this.dialog.open(IPlayerComponent, dialogConfig);
    }
  }

  onCommentClick(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      postID: this.postData.did
    };
  
    this.dialog.open(CommentsViewComponent, dialogConfig);
  }

}