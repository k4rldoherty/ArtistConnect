import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { normalUser } from 'src/app/models/users';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { PostData } from '../home/home.component';
import { concatMap, finalize, map, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user = this.auth.currentUser
  imageUrl!: string;
  downloadURL!: Observable<string>;
  testFollowers = [{ name: "Jimmy" },
  {
    name: "Yury"
  },
  {
    name: "Conor"
  },
  {
    name: "Mark"
  },
  ]

  testFollowing = [
    {
      name: "Jimmy"
    },
    {
      name: "Yury"
    },
    {
      name: "Conor"
    },
    {
      name: "Mark"
    },
  ]
  feedPosts: PostData[] = []
  constructor(public firebase: FirebaseService, public firestore: AngularFirestore, public dialog: MatDialog, public auth: AngularFireAuth, public storage: AngularFireStorage) {
  }


  ngOnInit(): void {
    this.getPosts();
    this.downloadURL.subscribe(url => {
      this.firebase.imageURL = url;
    });
  }

  getPosts() {
    let id = this.firebase.userData.uid
    this.firestore.collection('posts', ref => ref
      .where('uid', '==', id)
      .limit(10),
    )
      .snapshotChanges()
      .pipe(
        map((actions) => actions.map(a => {
          const data = a.payload.doc.data() as PostData;
          const did = a.payload.doc.id;
          return { ...data, did };
        }))
      )
      .subscribe(postsData => {
        this.feedPosts = postsData;
      });
  }

  openDialog() {
    this.dialog.open(EditProfileComponent, {
      height: '500px',
      width: '600px',
    });
  }


  uploadImage(event: any) {
    let file = event.target.files[0];
    let filePath = `images/${this.firebase.userData.uid}.jpg`; // replace this.userId with actual user ID
    let fileRef = this.storage.ref(filePath);
    let task = fileRef.put(file);
    
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(url => {
          this.imageUrl = url;
        });
      })
      )
      .subscribe();
      alert('Servers are busy. Upload may take a few seconds')
    }
}


