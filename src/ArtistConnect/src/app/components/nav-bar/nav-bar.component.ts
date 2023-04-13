import { Component, OnInit } from '@angular/core';
import { faHome, faEnvelope, faMusic, faUser, faSignOutAlt, faMapPin } from '@fortawesome/free-solid-svg-icons';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  faHome = faHome;
  faEnvelope = faEnvelope;
  faMusic = faMusic;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  faMapPin = faMapPin;

  constructor(public firebase: FirebaseService) { }

  ngOnInit(): void {
  }

}
