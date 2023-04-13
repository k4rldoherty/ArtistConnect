import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { MatDialog } from '@angular/material/dialog'
import { CreatePostComponent } from '../create-post/create-post.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
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
  distanceFilter!: number;
  constructor(public firebase: FirebaseService, private dialog: MatDialog, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.getPosts();
  }

  getUserLocation(callback: (location: { lat: number, lon: number }) => void, errorCallback: (error: any) => void): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          callback(location);
        },
        error => {
          console.error(error);
          errorCallback(error);
        }
      );
    } else {
      const errorMessage = 'Geolocation is not supported by this browser.';
      console.error(errorMessage);
      errorCallback(errorMessage);
    }
  }

  toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  async getPosts() {
    this.filteredPosts =  [];
    let userIds: any[] = [];
    let id = this.firebase.userData.uid;
    this.firestore.collection('users', (ref) => ref.where('uid', '!=', id)).valueChanges()
      .pipe(
        map((users) => users.map((user: any) => user.uid))
      ).subscribe((uids) => {
        this.firestore.collection('posts', ref => ref
        .where('uid', 'in', uids)
        .where('type','==', 'event')
        .orderBy('timestamp', 'desc')
        )
        .snapshotChanges()
        .pipe(
         map(actions => actions.map(a => {
          const data = a.payload.doc.data() as PostData;
          const did = a.payload.doc.id;
          return { ...data, did };
        })),
      )
      .subscribe(async (postsData) => { // Use async keyword here
        for (let post of postsData){
          if (post.eventDetails.lat){
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                position => {
                  const location = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                  };
                  let distance = this.getDistance(post.eventDetails.lat, post.eventDetails.long, location.lat, location.lon)
                  console.log(distance)
                  if (!this.distanceFilter){
                    this.filteredPosts.push(post)
                  }
                  else if (this.distanceFilter > distance){
                    this.filteredPosts.push(post)
                  }
                },
                error => {
                  console.error(error);
                }
              );
            } else {
              const errorMessage = 'Geolocation is not supported by this browser.';
              console.error(errorMessage);
            }
            //if (await this.getDistance(post.eventDetails.lat, post.eventDetails.long) < 4.8){
            //this.filteredPosts.push(post)
            //}
          }
        }
      });
    });
  }

  getDistance(evlat: string, evlong: string, userlat: number, userlong: number): number{
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

}
// import { Component, OnInit } from '@angular/core';
// import { FirebaseService } from 'src/app/services/firebase.service';
// import { MatDialog } from '@angular/material/dialog'
// import { CreatePostComponent } from '../create-post/create-post.component';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { map } from 'rxjs/operators';
// import { PostData } from '../home/home.component';

// @Component({
//   selector: 'app-event-finder',
//   templateUrl: './event-finder.component.html',
//   styleUrls: ['./event-finder.component.scss']
// })
// export class EventFinderComponent implements OnInit {
//   user = localStorage.getItem('user');
//   userLocation!: { lat: number, lon: number };
//   filteredPosts: PostData[] = [];
//   constructor(public firebase: FirebaseService, private dialog: MatDialog, private firestore: AngularFirestore) { }
  

//   ngOnInit(): void {
//     this.getPosts();
//   }

//   getUserLocation(): Promise<any> {
//     return new Promise((resolve, reject) => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           position => {
//             const location = {
//               lat: position.coords.latitude,
//               lon: position.coords.longitude
//             };
//             resolve(location);
//           },
//           error => {
//             console.error(error);
//             reject(error);
//           }
//         );
//       } else {
//         const errorMessage = 'Geolocation is not supported by this browser.';
//         console.error(errorMessage);
//         reject(errorMessage);
//       }
//     });
//   }

//   getDistance(lat: string, long:string): Promise<number> {
//     return new Promise((resolve, reject) => {
//       let eventlat = Number(lat);
//       let eventlong = Number(long);
//       this.getUserLocation()
//       .then(location => {
//         let userlat = location.lat
//         let userlong = location.lon
//         const R = 6371; // Earth's radius in kilometers
//         const dLat = this.toRadians(eventlat - userlat);
//         const dLon = this.toRadians(eventlong - userlong);
//         const a =
//           Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//           Math.cos(this.toRadians(userlat)) * Math.cos(this.toRadians(eventlat)) *
//           Math.sin(dLon / 2) * Math.sin(dLon / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         const distance = R * c; // Distance in kilometers
//         resolve(distance);
//       })
//       .catch(error => {
//         console.error(error);
//         reject(error);
//       });
//     });
//   }

//   toRadians(degrees: number): number {
//     return degrees * Math.PI / 180;
//   }

//   async getPosts() { // Use async keyword here
//     let userIds: any[] = [];
//     let id = this.firebase.userData.uid;
//     this.firestore.collection('users', (ref) => ref.where('uid', '!=', id)).valueChanges()
//       .pipe(
//         map((users) => users.map((user: any) => user.uid))
//       ).subscribe((uids) => {
//         this.firestore.collection('posts', ref => ref
//         .where('uid', 'in', uids)
//         .where('type','==', 'event')
//         .orderBy('timestamp', 'desc')
//         )
//         .snapshotChanges()
//         .pipe(
//          map(actions => actions.map(a => {
//           const data = a.payload.doc.data() as PostData;
//           const did = a.payload.doc.id;
//           return { ...data, did };
//         })),
//       )
//       .subscribe(async (postsData) => { // Use async keyword here
//         for (let post of postsData){
//           if (post.eventDetails.lat){
//             if ( await this.getDistance(post.eventDetails.lat, post.eventDetails.long) > 1){
//             this.filteredPosts.push(post)
//             }
//           }
//         }
//       });
//     });
//   }
// }

// // for (let post of postsData){
// //   if (post.eventDetails.lat){
// //     console.log(await this.getDistance(post.eventDetails.lat, post.eventDetails.long)); // use await here
// //     this.filteredPosts.push(post)
// // }