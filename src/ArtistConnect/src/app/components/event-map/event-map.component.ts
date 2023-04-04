import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-event-map',
  templateUrl: './event-map.component.html',
  styleUrls: ['./event-map.component.scss']
})
export class EventMapComponent implements OnInit {
  link!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer : DomSanitizer
    ) { }

  ngOnInit(): void {
    const venueValue = this.data.venue.replace(/\s/g, "%20").replace(/&/g, "%26");
    const cityValue = this.data.city.replace(/\s/g, "%20");
    const locationTerms = `${venueValue}%20${cityValue}`;
    //Google Maps API Key: AIzaSyCkzjjQv5IUTC0yz1HTYDtP8KFvx2xuWwM
    let url = `https://www.google.com/maps/embed/v1/place?q=${locationTerms}&key=AIzaSyCkzjjQv5IUTC0yz1HTYDtP8KFvx2xuWwM`;
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    console.log(this.link);
  }

}
