import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { ConversationComponent } from './components/conversation/conversation.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MessengeCenterComponent } from './components/messenge-center/messenge-center.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SongRecommenderComponent } from './components/song-recommender/song-recommender.component';
import { EventFinderComponent } from './components/event-finder/event-finder.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    // Need to add a gaurd here to not allow users who aren't signed in to access the homepage
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'user/:uid', component: UserProfileComponent
  },
  {
    path: 'message-centre', component: MessengeCenterComponent
  },
  {
    path: 'message-centre/:conversationId', component: ConversationComponent
  },
  {
    path: 'recommend',
    component: SongRecommenderComponent
  },
  {
    path: 'finder',
    component: EventFinderComponent
  },
  {
    path: 'search',
    component: SearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules // added this line not sure why this is needed
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
