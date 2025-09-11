import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-browse-movies',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './browse-movies.component.html',
  styleUrls: ['./browse-movies.component.css']
})
export class BrowseMoviesComponent {
  // ✅ Movies data
  movies: any[] = [];
  topRatedMovies: any[] = [];
  filteredMovies: any[] = [];
  paginatedMovies: any[] = [];

  // ✅ Watchlist
  watchlist: any[] = [];
  watchlistCount: number = 0;

  // ✅ Filters & search
  searchText: string = '';
  searchTerm: string = '';
  selectedQuality: string = 'All';
  selectedGenre: string = 'All';
  selectedRating: string = 'All';
  selectedYear: string = 'All';
  selectedOrder: string = 'Featured';

  ratings: number[] = [1,2,3,4,5,6,7,8,9,10];
  years: number[] = Array.from({length: 50}, (_, i) => new Date().getFullYear() - i);
  genres: string[] = [];
  genreMap: { [id: number]: string } = {};

  // ✅ Pagination
  currentPage: number = 1;
  moviesPerPage: number = 15;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const search = params['search'];

      // load genres
      this.movieService.getGenres().subscribe((res: any) => {
        res.genres.forEach((g: any) => this.genreMap[g.id] = g.name);
        this.genres = Object.values(this.genreMap);

        // load movies depende sa state
        const state = window.history.state;
        if (state.filter === 'top-rated') {
          this.loadAllTopRated();
        } else {
          this.loadPopularMovies();
        }

        if (search) {
          this.searchText = search;
          this.searchMovies();
        } else if (state.search) {
          this.searchText = state.search;
          this.searchMovies();
        }

        this.loadTopRatedPreview();
      });
    });

    this.loadWatchlist();
    this.updateWatchlistCount();
  }

  // ✅ Load 100 popular movies (5 pages x 20)
  async loadPopularMovies() {
    const requests = [];
    for (let p = 1; p <= 5; p++) {
      requests.push(this.movieService.getPopularMovies(p).toPromise());
    }

    const responses = await Promise.all(requests);
    this.movies = responses.flatMap((res: any) =>
      res.results.map((movie: any) => ({
        ...movie,
        genre: movie.genre_ids.map((id: number) => this.genreMap[id]).join(', ')
      }))
    );

    this.filteredMovies = [...this.movies];
    this.setPage(1);
  }

  // ✅ Set paginated results
  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.moviesPerPage;
    const endIndex = startIndex + this.moviesPerPage;
    this.paginatedMovies = this.filteredMovies.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMovies.length / this.moviesPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  // ✅ Preview top rated (6 lang)
  loadTopRatedPreview() {
    this.movieService.getTopRatedMovies().subscribe((res: any) => {
      this.topRatedMovies = res.results.slice(0, 6).map((movie: any) => ({
        ...movie,
        genre: movie.genre_ids.map((id: number) => this.genreMap[id]).join(', ')
      }));
    });
  }

  // ✅ Lahat ng top rated
  loadAllTopRated() {
    this.movieService.getTopRatedMovies().subscribe((res: any) => {
      this.movies = res.results.map((movie: any) => ({
        ...movie,
        genre: movie.genre_ids.map((id: number) => this.genreMap[id]).join(', ')
      }));
      this.filteredMovies = [...this.movies];
      this.setPage(1);
    });
  }

  // ✅ Search movies
  searchMovies() {
    if (!this.searchText.trim()) {
      this.filteredMovies = [...this.movies];
      this.setPage(1);
      return;
    }

    this.movieService.searchMovies(this.searchText).subscribe((res: any) => {
      this.filteredMovies = res.results.map((movie: any) => ({
        ...movie,
        genre: movie.genre_ids.map((id: number) => this.genreMap[id]).join(', ')
      }));
      this.setPage(1);
    });
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


  // ✅ Watchlist
  addToWatchlist(movie: any) {
    if (!this.watchlist.find(m => m.id === movie.id)) {
      this.watchlist.push(movie);
      localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
      this.updateWatchlistCount();
      alert(`${movie.title} added to Watchlist!`);
    } else {
      alert(`${movie.title} is already in Watchlist!`);
    }
  }

  loadWatchlist() {
    this.watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
  }

  updateWatchlistCount() {
    this.watchlistCount = this.watchlist.length;
  }

  // ✅ Navigate to details page
  goToDetails(movie: any) {
    this.router.navigate(['/movie', movie.id]);
  }

  // ✅ Filters
  applyFilters() {
    this.filteredMovies = this.movies.filter(movie => {
      return (!this.searchTerm || movie.title.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
             (this.selectedGenre === 'All' || movie.genre.includes(this.selectedGenre)) &&
             (this.selectedRating === 'All' || movie.vote_average >= +this.selectedRating) &&
             (this.selectedYear === 'All' || movie.release_date?.startsWith(this.selectedYear.toString())) &&
             (this.selectedQuality === 'All' || movie.quality === this.selectedQuality);
    });

    if (this.selectedOrder === 'Newest') {
      this.filteredMovies.sort((a,b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
    } else if (this.selectedOrder === 'HighestRated') {
      this.filteredMovies.sort((a,b) => b.vote_average - a.vote_average);
    }

    this.setPage(1);
  }
}
