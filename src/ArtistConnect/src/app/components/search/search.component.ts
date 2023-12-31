import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { normalUser } from 'src/app/models/users';
import { PostData } from '../home/home.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchMode: boolean = false;
  searchResultsPosts: PostData[] = [];
  searchResultsUsers: normalUser[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebase: FirebaseService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchQuery = params.get('q')?.toLowerCase();
      if (searchQuery) {
        this.firebase.getFilteredSearchResultsUser(searchQuery).subscribe((searchResultsUsers: any) => {
          this.searchResultsUsers = searchResultsUsers;
        });
        this.firebase.getFilteredSearchResultsPost(searchQuery).subscribe((searchResultsPosts: any) => {
          this.searchResultsPosts = searchResultsPosts;
        });
      }
    });
  }
  
  ngOnChanges(changes: SimpleChanges) {
    const searchQueryChange = changes['searchQuery'];
    if (searchQueryChange && !searchQueryChange.firstChange) {
      const searchQuery = searchQueryChange.currentValue;
      this.updateSearchResults(searchQuery);
    }
  }
  
  updateSearchResults(searchQuery: string) {
    this.searchResultsPosts = [];
    this.searchResultsUsers = [];
    this.firebase.getFilteredSearchResultsUser(searchQuery).subscribe((searchResultsUsers: any) => {
      this.searchResultsUsers = searchResultsUsers;
    });
    this.firebase.getFilteredSearchResultsPost(searchQuery).subscribe((searchResultsPosts: any) => {
      this.searchResultsPosts = searchResultsPosts;
    });
  }
}
