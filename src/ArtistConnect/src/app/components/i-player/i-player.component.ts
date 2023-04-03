import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-i-player',
  templateUrl: './i-player.component.html',
  styleUrls: ['./i-player.component.scss']
})
export class IPlayerComponent implements OnInit {
songUrl: any;
token: any;
trackId: any;
link:any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer : DomSanitizer
  ) { 
  }

  ngOnInit(): void {
    this.songUrl = this.data.songUrl;
    this.trackId = this.data.trackId;
    let url = 'https://open.spotify.com/embed/track/' + this.trackId  + '?utm_source=generator&theme=0'
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  }

