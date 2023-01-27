import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedInEmail = '';
  constructor(public firebase: FirebaseService) { }

  ngOnInit(): void {
  }

  logout() {
    this.firebase.logout();
  }

}
