import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  selectedOption = 'option1';

  constructor(private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  onPost() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log(user.uid);
      }
    });
  }


}
