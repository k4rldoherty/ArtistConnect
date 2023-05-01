import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog } from '@angular/material/dialog'
import { CreatePostComponent } from '../create-post/create-post.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';
import { PostData } from '../home/home.component';

@Component({
  selector: 'app-event-finder',
  templateUrl: './event-finder.component.html',
  styleUrls: ['./event-finder.component.scss']
})
export class EventFinderComponent implements OnInit {
  user = localStorage.getItem('user');
  userLocation!: { lat: number, lon: number };
  filteredPosts: PostData[] = [];
  distanceFilter!: any;
  countrySelect!: string;
  citySelect!: string;
  timeframeFilter!: any;
  specificDate!: any;
  whereFilter: string;
  whenFilter: string;

  constructor(public firebase: FirebaseService, private dialog: MatDialog, private firestore: AngularFirestore) {
    this.whereFilter = 'none';
    this.whenFilter = 'none'
  }

  ngOnInit(): void {

    //this.getOtherUids();
    //this.getPosts();

  }

  getUserLocation(): Promise<{ lat: number, lon: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const location = {
              lat: position.coords.latitude,
              lon: position.coords.longitude
            };
            resolve(location);
          },
          error => {
            console.error(error);
            reject(error);
          }
        );
      } else {
        const errorMessage = 'Geolocation is not supported by this browser.';
        console.error(errorMessage);
        reject(errorMessage);
      }
    });
  }


  toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  getDistance(evlat: string, evlong: string, userlat: number, userlong: number): number {
    let eventlat = Number(evlat);
    let eventlong = Number(evlong);
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(eventlat - userlat);
    const dLon = this.toRadians(eventlong - userlong);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(userlat)) * Math.cos(this.toRadians(eventlat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance
  }

  getPosts() {
    this.filteredPosts = [];
    let userIds: any[] = [];
    let id = this.firebase.userData.uid;
    this.firestore.collection('users', (ref) => ref.where('uid', '!=', id)).valueChanges()
      .pipe(
        map((users) => users.map((user: any) => user.uid)),
        take(1)
      ).subscribe(async (uids) => { // Use 'async' here to use 'await' for getUserLocation()
        try {
          const userLocation = await this.getUserLocation(); // Use 'await' to get userLocation
          this.userLocation = userLocation;

          this.firestore.collection('posts', ref => ref
            .where('uid', 'in', uids)
            .where('type', '==', 'event')
            .orderBy('timestamp', 'desc')
          )
            .snapshotChanges()
            .pipe(
              map(actions => actions.map(a => {
                const data = a.payload.doc.data() as PostData;
                const did = a.payload.doc.id;
                return { ...data, did };
              })),
              take(1)
            )
            .subscribe(async (postsData) => {
              for (let post of postsData) {
                //Where and When Selected
                if (this.whenFilter != 'none' && this.whereFilter != 'none') {
                  if (this.whereFilter == 'distance') {
                    let distance = this.getDistance(post.eventDetails.lat, post.eventDetails.long, this.userLocation.lat, this.userLocation.lon);
                    if (distance < this.distanceFilter) {
                      if (this.whenFilter == 'exactDate' && this.dateSearch(post, this.specificDate)) {
                        this.filteredPosts.push(post);
                      }
                      else if (this.whenFilter == 'timeframe' && this.timeframeSearch(post, this.timeframeFilter)) {
                        this.filteredPosts.push(post);
                      }
                    }
                  } 
                  else if (this.whereFilter == "location" && this.locationSearch(post, this.citySelect, this.countrySelect)) {
                    if (this.whenFilter == 'exactDate' && this.dateSearch(post, this.specificDate)) {
                      this.filteredPosts.push(post);
                    }
                    else if (this.whenFilter == 'timeframe' && this.timeframeSearch(post, this.timeframeFilter)) {
                      this.filteredPosts.push(post);
                    }
                  }
                }
                //Only where is selected
                else if (this.whenFilter == 'none' && this.whereFilter != 'none') {
                  if (this.whereFilter == 'distance') {
                    let distance = this.getDistance(post.eventDetails.lat, post.eventDetails.long, this.userLocation.lat, this.userLocation.lon);
                    if (distance < this.distanceFilter) {
                      this.filteredPosts.push(post);
                    }
                  } 
                  else if (this.whereFilter == "location" && this.locationSearch(post, this.citySelect, this.countrySelect)){
                    this.filteredPosts.push(post);
                  }
                }
                //only when is selected
                else if (this.whenFilter != 'none' && this.whereFilter == 'none'){
                  if (this.whenFilter == 'exactDate' && this.dateSearch(post, this.specificDate)) {
                    this.filteredPosts.push(post);
                  }
                  else if (this.whenFilter == 'timeframe' && this.timeframeSearch(post, this.timeframeFilter)) {
                    this.filteredPosts.push(post);
                  }
                }
                // // no filters
                else if (this.whenFilter == 'none' && this.whereFilter == 'none'){
                  this.filteredPosts.push(post);
                }
              }
            });
        } catch (error) {
          console.error(error);
        }
      },
        error => {
          console.error(error);
        });
  }

  locationSearch(post: any, city: string, country: string) {
    if (post.eventDetails.city == city || post.eventDetails.country == country) {
      return true;
    }
    return false;
  }

  dateSearch(post: any, date: string) {
    if (post.eventDetails.date == date) {
      return true;
    }
    return false;
  }

  timeframeSearch(post: any, timeframe: string) {
    let evDate = new Date(post.eventDetails.date)
    let today = new Date();
    if (this.timeframeFilter == '1') {
      const nextWeek = today.getTime() + 7 * 24 * 60 * 60 * 1000; // add 7 days in milliseconds
      return evDate.getTime() <= nextWeek && evDate.getTime() >= today.getTime();
    }
    else if (this.timeframeFilter == '2') {
      const twoWeeksFromNow = today.getTime() + 14 * 24 * 60 * 60 * 1000; // add 14 days in milliseconds
      return evDate.getTime() <= twoWeeksFromNow && evDate.getTime() >= today.getTime();
    }
    else if (this.timeframeFilter == '3') {
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      return evDate <= nextMonth && evDate >= today;
    }
    else if (this.timeframeFilter == '4') {
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 3);
      return evDate <= nextMonth && evDate >= today;
    }
    return false;
  }



}
