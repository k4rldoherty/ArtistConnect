import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { faUser, faIdBadge, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  faUser = faUser;
  faIdBadge = faIdBadge;
  faCog = faCog;
  faSignOutAlt = faSignOutAlt;
  loggedInEmail = '';
  constructor(public firebase: FirebaseService) { }

  ngOnInit(): void {
  }

  logout() {
    this.firebase.logout();
  }

}

