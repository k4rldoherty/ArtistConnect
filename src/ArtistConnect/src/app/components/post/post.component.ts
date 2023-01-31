import { Component, Input, OnInit } from '@angular/core';
import { PostData } from '../home/home.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';

export interface UserData {
  displayName: string
  country: string
  county: string
  dob: string
  email: string
  uid: string
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input()
  postData!: PostData;
  postProfiles: UserData [] = []
  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.getName();
  }

  getName(){
    let u = this.postData.uid
    this.firestore.collection('users', ref => ref
        .where('uid', '==', u)
        .limit(1),
        )
        .snapshotChanges()
        .pipe(
        map(actions => actions.map(a => {
        const data = a.payload.doc.data() as UserData;
        const did = a.payload.doc.id;
        return { ...data, did };
        }))
        )
        .subscribe(profiles => {
        this.postProfiles = profiles;
        });
  }
}
