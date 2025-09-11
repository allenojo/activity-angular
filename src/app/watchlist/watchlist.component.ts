import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent {
  watchlist: any[] = [];
  searchText: string = ''; // ✅ para sa search bar

  ngOnInit() {
    this.loadWatchlist();
  }

  // ✅ Load watchlist
  loadWatchlist() {
    this.watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
  }

  // ✅ Remove movie from watchlist
  removeFromWatchlist(movie: any) {
    this.watchlist = this.watchlist.filter(m => m.id !== movie.id);
    localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
  }

  // ✅ Watch movie (sample: open sa TMDB)
  watchMovie(movie: any) {
    const url = `https://www.themoviedb.org/movie/${movie.id}`;
    window.open(url, '_blank'); 
  }

  // ✅ Search filter sa loob ng watchlist
  searchMovies() {
    if (!this.searchText.trim()) {
      this.loadWatchlist();
    } else {
      this.watchlist = this.watchlist.filter(m =>
        m.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }
}
