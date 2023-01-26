import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user = localStorage.getItem('user');
  constructor(private firebase: FirebaseService) { }
  
  ngOnInit(): void {
  }


  logout() {
    this.firebase.logout()
  }

}
