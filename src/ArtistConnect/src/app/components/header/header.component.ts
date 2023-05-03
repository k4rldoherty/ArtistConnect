import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { faUser, faIdBadge, faCog, faSignOutAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NavigationExtras, Router } from '@angular/router';

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
  faSearch = faSearch
  searchTerm!: string;
  
  constructor(public firebase: FirebaseService, public router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    this.firebase.logout();
  }

  onSubmitSearchButton() {
    this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } });
  }
}

