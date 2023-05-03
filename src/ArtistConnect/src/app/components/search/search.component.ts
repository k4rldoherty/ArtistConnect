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
  userIndex: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebase: FirebaseService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchQuery = params.get('q')?.toLowerCase();
      console.log("SearchQuery", searchQuery);
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
      console.log("Updated SearchQuery", searchQuery);
      this.updateSearchResults(searchQuery);
    }
  }

  updateSearchResults(searchQuery: string) {
    this.firebase.getFilteredSearchResultsUser(searchQuery).subscribe((searchResultsUsers: any) => {
      this.searchResultsUsers = searchResultsUsers;
    });
    this.firebase.getFilteredSearchResultsPost(searchQuery).subscribe((searchResultsPosts: any) => {
      this.searchResultsPosts = searchResultsPosts;
    });
  }
}
