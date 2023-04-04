import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore/';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { AngularFireStorageModule } from '@angular/fire/compat/storage'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { FirebaseService } from './services/firebase.service';
import { ProfileComponent } from './components/profile/profile.component';
import { PostComponent } from './components/post/post.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { IPlayerComponent } from './components/i-player/i-player.component';
import { NavBarComponent } from '../app/components/nav-bar/nav-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CommentsViewComponent } from './components/comments-view/comments-view.component';
import { MessengeCenterComponent } from './components/messenge-center/messenge-center.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { EventMapComponent } from './components/event-map/event-map.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HeaderComponent,
    CreatePostComponent,
    ProfileComponent,
    PostComponent,
    EditProfileComponent,
    IPlayerComponent,
    NavBarComponent,
    UserProfileComponent,
    CommentsViewComponent,
    MessengeCenterComponent,
    ConversationComponent,
    EventMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    HttpClientModule,
    AngularFireFunctionsModule,
    MatTabsModule,
    FontAwesomeModule,
    MatListModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatRadioModule
  ],
  providers: [
    {provide: FIREBASE_OPTIONS, useValue: environment.firebase},
    FirebaseService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

