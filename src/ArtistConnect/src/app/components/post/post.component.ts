import { Component, Input, OnInit } from '@angular/core';
import { PostData } from '../home/home.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { map, take } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { IPlayerComponent } from '../i-player/i-player.component';
import { CommentsViewComponent } from '../comments-view/comments-view.component';
import { Router } from '@angular/router';
import { EventMapComponent } from '../event-map/event-map.component';
import { faEllipsisH, faTrash, faFlag, faUser, faMusic, faMapMarker, faHeart } from '@fortawesome/free-solid-svg-icons';
import { LikeViewComponent } from '../like-view/like-view.component';
import firebase from 'firebase/compat/app';
import { MatSnackBar } from '@angular/material/snack-bar';


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
  faEllipsisH = faEllipsisH;
  faTrash = faTrash;
  faFlag = faFlag;
  faUser = faUser;
  faMusic = faMusic;
  faMapMarker = faMapMarker;
  faHeart = faHeart;


  constructor(
    private firestore: AngularFirestore,
    public firebase: FirebaseService,
    private fauth: AngularFireAuth,
    private http: HttpClient,
    private functions: AngularFireFunctions,
    private dialog: MatDialog,
    public router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getName();
    this.getLikeCount();
  }

  onReport(){
    //ACkarlyury0026
    let ts = firebase.firestore.FieldValue.serverTimestamp();
    
    this.fauth.authState.subscribe(user => {
      if (user) {
        this.firestore.collection('reports').add({
          timestamp: ts,
          reported_by: user.uid,
          post: this.postData.did,
          investigated: false
        });
      }
    });
    this.snackBar.open('Your report has been received and will be investigated', 'Close', {
      duration: 5000
    });
  }

  onDelete(){
    const snackBarRef = this.snackBar.open('Are you sure you want to delete this post?', 'Delete', {
      duration: 5000
    });
    
    snackBarRef.onAction().subscribe(() => {
      this.firestore.collection('posts').doc(this.postData.did).delete();
      this.snackBar.open('Post Deleted', 'Close', {
        duration: 5000
      });
    });
  }

  recommend() {
    const inputVal = this.postData.songUrl;
    this.router.navigate(['/recommend'], { queryParams: { inputVal: inputVal } });
  }

  getName() {
    let userId = this.postData.uid;
    this.firebase.getUser(userId).subscribe(user => {
      this.creator = user;
    });
  }

  getLikeCount() {
    const postId = this.postData.did
    this.firestore
      .collection(`posts/${postId}/likes`)
      .valueChanges()
      .subscribe((querySnapshot) => {
        this.count = querySnapshot.length;
      });
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
  onPlayClick() {
    let source = this.postData.source;
    if (source == "uknown") {
      window.open(this.postData.songUrl, "_blank");
    }
    else if (source == "Spotify") {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        songUrl: this.postData.songUrl,
        token: this.authtoken,
        trackId: this.postData.id

      };

      this.dialog.open(IPlayerComponent, dialogConfig);
    }
  }

  onCommentClick() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      postID: this.postData.did,
      username: this.creator.displayName
    };

    this.dialog.open(CommentsViewComponent, dialogConfig);
  }

  viewLikes(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      postID: this.postData.did,
    };

    this.dialog.open(LikeViewComponent, dialogConfig);
  }


  openMap() {
    const dialogRef = this.dialog.open(EventMapComponent, {
      data: {
        venue: this.postData.eventDetails.venue,
        city: this.postData.eventDetails.city,
        name: this.postData.eventDetails.name
      }
    });
  }

  buyTickets() {
    window.open(this.postData.eventDetails.url, "_blank")
  }

}