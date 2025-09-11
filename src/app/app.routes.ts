// app.routes.ts
import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { MoviesComponent } from './movies/movies.component';
import { BrowseMoviesComponent } from './browse-movies/browse-movies.component'; // ✅ bagong import
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { WatchlistComponent } from './watchlist/watchlist.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'browse-movies', component: BrowseMoviesComponent }, // ✅ browse-only page
  { path: 'manage-movies', component: MoviesComponent },       // ✅ add/edit/delete page
  { path: 'watchlist', component: WatchlistComponent }, // ✅ new route
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },     // details route
  { path: '**', redirectTo: '' }                               // fallback
];
