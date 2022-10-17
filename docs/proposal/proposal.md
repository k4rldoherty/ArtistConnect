# School of Computing &mdash; Year 4 Project Proposal Form


## SECTION A

|                     |                   |
|---------------------|-------------------|
|Project Title:       | ArtistConnect     |
|Student 1 Name:      | Yury Chupahin     |
|Student 1 ID:        | 19416764          |
|Student 2 Name:      | Karl Doherty      |
|Student 2 ID:        | 19413086          |
|Project Supervisor:  | Gareth Jones      |

## SECTION B


### Introduction

The general area covered by this project is providing a platform for music artists, people in the music industry and general listeners of music to be able to connect and collaborate. Artists will be able to promote their music and gigs that they have coming up, they will also be able to find other artists and people in the music industry to work and collaborate with. Regular listeners of music will be able to follow their favorite artists and keep up to date with anything that they are doing, they will also be able to share music and events that are not theirs but that they are just interested in. Finally both artists and regular users will be able to make use of the discover functionality where they will be able to find new music/artists/events that they might be interested in.

### Outline

The project will be a client server based  web application where regular listeners of music and artists can sign up and create profiles for themselves based on either what kind of music they make or are interested in. Users will be able to create posts containing information on music and events. The posts will be visible in a chronological format in a wall format on each user's profile page. Users will be able to follow other profiles, posts made by the users followed profiles will be displayed in a feed. The user will be able to filter their feed by things like type of content in posts, date, location, etc…. . Alongside the posts there will be a direct messaging feature to allow for private communication between users. We hope to incorporate a recommender system into the application which will recommend new music, artists and events to users. This recommender function will be used in different parts of the application but its main use will be in a feed separate to the users standard feed specifically designed for discovery.
There will be two types of profiles users can create, creator or regular. Both accounts will be limited to the types of posts they can make to keep the platform clutter free and different to regular social media , these posts will contain information about  music or events . Users with creator accounts will have the ability to create an additional type of post which will be collaboration requests that only other creator account holders can view.  We hope to embed APIs from event companies like Ticketmaster and streaming services like Spotify to give the posts more functionality and to allow users to directly access the song / event tickets that they see promoted on our application.


### Background

Both of us working on this project are huge fans of music and go to as many gigs as possible each year. The main method we have of finding out about events or new music is through regular social media which is overloaded with so many other aspects and topics it is quite common for us to miss events or find out about a new song a few months after release. So we thought a clutter free platform dedicated just to music and related events would be ideal for music events. The collaboration aspect came from seeing many unsuccessful posts on forums and social media about artists searching for people to work with and not receiving any responses. If it was added to our platform artists who follow each other will be able to see what other artists are looking for and if they don’t follow them they can go through their profile and see if they would work well together. 

### Achievements

The user will be music fans, musicians, producers, DJs and other people in the music industry. The project will allow users to keep up to date with their favorite artists' music and gigs. Users will be able to message artists and other users with similar interests. There will also be functions which aid users in discovering new artists and music like recommendations or the ability to view what is trending on the platform. There will be a function for artists to promote their music and events and regular users share music they like or events they are interested in. There will be a function where artists can post on their profile if they are searching for someone to collaborate with or they are available to collaborate if someone needs.

### Justification

This is useful for artists whenever they need to promote new events, new music or find someone to collaborate with. It's useful for music fans wanting to keep up to date with artists that they like and find new music/artists.

### Programming language(s)

The programming languages we plan to use as part of the project are TypeScript, HTML and Sassy Cascading Style Sheets (SCSS). This will all be done using the Angular framework

### Programming tools / Tech stack

We are going to use Firebase Firestore Database, Angular frontend framework and mostly likely Firebase Hosting to host the application on a server.

### Learning Challenges

There are a number of challenges that we may encounter over the course of creating this application. Firstly, the Angular framework is a new technology to us so we will be essentially learning a brand new web application framework. So as we work on developing the application, we will be educating ourselves and broadening our areas of knowledge in the web development sector. Secondly, the main language used in Angular is TypeScript, which we have never used before. This is a popular front end development language, and is a superset of the JavaScript language. This essentially means it has all the features of javascript, as well as some additional ones.
Another challenge we will have to overcome is managing and maintaining a large database with many collections of data, users, posts, likes, followers and so on. It is imperative that we come up with an adequate database design before beginning development of the project to ensure that as there are more users all the data is easily retrievable and stored in such a way that it is still efficient and does not lead to slow loading times.
Finally, we will have to figure out what our best approach is for a machine learning recommender system that will show users new songs / artists / events. This will be difficult as we have never designed such a system before.There will certainly be some research and experimentation required to find an algorithm or solution for implementing this that best fits the needs of our application. We have already discussed a couple of different algorithms that we can use and we will have to research other recommender systems to see what they do right and how we could possibly improve on the things they fall short on. This will certainly be one of the most challenging aspects of our project.


### Breakdown of work

#### Student 1: Yury

Will be working on the backend functions such as retrieving information from the database
Will work on getting the website up and running on a firebase cloud server

#### Student 2: Karl

Will be designing the layout and styling for the application
Will be working on the frontend functionality such as buttons and routes for the website


