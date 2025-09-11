import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieService } from '../movie.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent {
  movie: any;
  watchlist: any[] = [];
  watchlistCount = 0;
  searchText: string = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get movie by ID
    const id = this.route.snapshot.params['id'];
    this.movieService.getMovieDetails(id).subscribe((res: any) => {
      this.movie = res;
      console.log('Movie Details:', this.movie);
    });

    // Load watchlist
    this.loadWatchlist();
  }

  // ✅ Load watchlist at count
  loadWatchlist() {
    const savedWatchlist = localStorage.getItem('watchlist');
    this.watchlist = savedWatchlist ? JSON.parse(savedWatchlist) : [];
    this.watchlistCount = this.watchlist.length;
  }

  watchNow(movie: any) {
  // ✅ 1. Save to Watchlist (automatic)
  const list = JSON.parse(localStorage.getItem('watchlist') || '[]');
  if (!list.find((m: any) => m.id === movie.id)) {
    list.push(movie);
    localStorage.setItem('watchlist', JSON.stringify(list));
    this.watchlistCount = list.length;
    alert(`${movie.title} has been added to your Watchlist!`);
  }

  // ✅ 2. Open movie site (TMDb link gamit ang movie.id)
  window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank');
}

  // ✅ Add to watchlist
  addToWatchlist(movie: any) {
    if (!this.watchlist.find(m => m.id === movie.id)) {
      this.watchlist.push(movie);
      alert(`${movie.title} ay naidagdag sa Watchlist mo!`);
    } else {
      alert(`${movie.title} ay nasa Watchlist mo na.`);
    }
    localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
    this.watchlistCount = this.watchlist.length;
  }

  // ✅ Search function
  searchMovies() {
    if (this.searchText.trim() !== '') {
      this.router.navigate(['/browse-movies'], {
        queryParams: { search: this.searchText }
      });
      this.searchText = ''; // clear after search
    }
  }
}
