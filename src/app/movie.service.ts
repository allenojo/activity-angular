import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = environment.tmdbApiKey; // ✅ gamit environment API key

  constructor(private http: HttpClient) {}

  // ✅ Popular movies (with page parameter)
  getPopularMovies(page: number = 1): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/movie/popular?api_key=${this.apiKey}&language=en-US&page=${page}`
    );
  }

  // ✅ Top rated movies (with page parameter)
  getTopRatedMovies(page: number = 1): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/movie/top_rated?api_key=${this.apiKey}&language=en-US&page=${page}`
    );
  }

  // ✅ Search movies
  searchMovies(query: string, page: number = 1): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/search/movie?api_key=${this.apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
    );
  }

  // ✅ Movie details
  getMovieDetails(id: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/movie/${id}?api_key=${this.apiKey}&language=en-US`
    );
  }

  // ✅ Genres
  getGenres(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/genre/movie/list?api_key=${this.apiKey}&language=en-US`
    );
  }
}
