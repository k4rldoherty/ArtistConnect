import { Component, OnInit, Output } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog } from '@angular/material/dialog'
import { CreatePostComponent } from '../create-post/create-post.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user = localStorage.getItem('user');
  constructor(public firebase: FirebaseService, private dialog: MatDialog) { }
  
  ngOnInit(): void {
  }


  logout() {
    this.firebase.logout()
  }

  createPostClick(){
    console.log('create button clicked');
    this.dialog.open( CreatePostComponent );
  }

}
