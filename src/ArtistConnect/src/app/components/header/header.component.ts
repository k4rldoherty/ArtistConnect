import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedInEmail = '';
  constructor(private firebase: FirebaseService) { }

  ngOnInit(): void {
    this.firebase.currentLoggedInEmail.subscribe(email => this.loggedInEmail = email)
  }

}
