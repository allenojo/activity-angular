import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Import para sa [(ngModel)]
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule], // ✅ dagdag FormsModule
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  watchlistCount = 0; // Count ng movies sa Watchlist
  topRatedMovies: any[] = []; // Para sa Top Rated section
  searchQuery: string = ''; // ✅ Search bar input
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router, private movieService: MovieService) {}

  ngOnInit() {
    this.loadWatchlist();
    this.loadTopRatedMovies();
  }

  // Load Watchlist mula sa localStorage
  loadWatchlist() {
    const list = JSON.parse(localStorage.getItem('watchlist') || '[]');
    this.watchlistCount = list.length;
  }

  // Scroll sa specific section
  scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Navigate sa Top Rated section sa Browse Movies page
  goToTopRated() {
    this.router.navigate(['/browse-movies'], { state: { filter: 'top-rated' } });
  }

  // Navigate sa movie details
  goToDetails(movie: any) {
    this.router.navigate(['/movie', movie.id]); // ✅ /movie/:id
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


  // ✅ Add to Watchlist (final, walang duplicate)
  addToWatchlist(movie: any) {
    const list = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (!list.find((m: any) => m.id === movie.id)) {
      list.push(movie);
      localStorage.setItem('watchlist', JSON.stringify(list));
      this.watchlistCount = list.length;
      alert(`${movie.title} added to Watchlist!`);
    } else {
      alert(`${movie.title} is already in Watchlist!`);
    }
  }

  // 🔀 Shuffle movies
  shuffleArray(array: any[]) {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  // ✅ Search function → pupunta sa browse-movies na may query
  searchMovies() {
    if (this.searchQuery.trim() !== '') {
      this.router.navigate(['/browse-movies'], {
        queryParams: { search: this.searchQuery }
      });
      this.searchQuery = ''; // clear after search
    }
  }

  // Load Top Rated movies (random 15 kada refresh)
  loadTopRatedMovies() {
    this.movieService.getTopRatedMovies().subscribe(res => {
      const shuffled = this.shuffleArray(res.results);
      this.topRatedMovies = shuffled.slice(0, 15);
    });
  }
}
