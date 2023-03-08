import { Component, OnInit } from '@angular/core';
import { faHome, faEnvelope, faMusic, faUser } from '@fortawesome/free-solid-svg-icons';

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

  constructor() { }

  ngOnInit(): void {
  }

}
