import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent {
  // Movie list with IDs
  movies = [
    { id: 1, title: 'Inception', year: 2010, poster: 'https://m.media-amazon.com/images/I/51s+8A6H0xL._AC_.jpg', description: 'A thief enters dreams to steal secrets.' },
    { id: 2, title: 'Interstellar', year: 2014, poster: 'https://m.media-amazon.com/images/I/71n58Tw4mEL._AC_SY679_.jpg', description: 'A team travels through a wormhole in search of a new home.' },
    { id: 3, title: 'The Dark Knight', year: 2008, poster: 'https://m.media-amazon.com/images/I/51k0qa6zY-L._AC_.jpg', description: 'Batman faces the Joker in Gotham.' },
    { id: 4, title: 'Avengers: Endgame', year: 2019, poster: 'https://m.media-amazon.com/images/I/81ExhpBEbHL._AC_SY679_.jpg', description: 'The Avengers assemble to defeat Thanos once and for all.' }
  ];

  // Search & filter properties
  searchText: string = '';
  filterYear: number | null = null;
  filteredMovies = [...this.movies];

  // Add movie properties
  newTitle: string = '';
  newYear: number | null = null;
  newPoster: string = '';
  newDescription: string = '';

  // Editing movie
  editingIndex: number | null = null;
  editTitle: string = '';
  editYear: number | null = null;
  editPoster: string = '';
  editDescription: string = '';

  constructor(private location: Location, private router: Router) {}

  // Navigate to details page (accepts only ID)
  goToDetails(id: number) {
    this.router.navigate(['/movie-details', id]);
  }

  // Back button
  goBack() {
    this.location.back();
  }

  // Filter movies
  filterMovies() {
    this.filteredMovies = this.movies.filter(movie => {
      const matchesTitle = movie.title.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesYear = this.filterYear ? movie.year === this.filterYear : true;
      return matchesTitle && matchesYear;
    });
  }

  // Reset filters
  resetFilters() {
    this.searchText = '';
    this.filterYear = null;
    this.filteredMovies = [...this.movies];
  }

  // Add a new movie
  addMovie() {
    if (!this.newTitle || !this.newYear || !this.newPoster) return;

    const newId = this.movies.length > 0 ? Math.max(...this.movies.map(m => m.id)) + 1 : 1;

    this.movies.push({
      id: newId,
      title: this.newTitle,
      year: this.newYear,
      poster: this.newPoster,
      description: this.newDescription || 'No description available.'
    });

    this.filterMovies(); // Update filtered list

    // Clear input fields
    this.newTitle = '';
    this.newYear = null;
    this.newPoster = '';
    this.newDescription = '';
  }

  // Delete a movie
  deleteMovie(index: number) {
    const movieToDelete = this.filteredMovies[index];
    const originalIndex = this.movies.indexOf(movieToDelete);
    if (originalIndex > -1) {
      this.movies.splice(originalIndex, 1);
    }
    this.filterMovies();
  }

  // Edit movie
  editMovie(index: number) {
    const movie = this.filteredMovies[index];
    this.editingIndex = index;
    this.editTitle = movie.title;
    this.editYear = movie.year;
    this.editPoster = movie.poster;
    this.editDescription = movie.description;
  }

  // Save edit
  saveEdit() {
    if (this.editingIndex === null) return;

    const movieToEdit = this.filteredMovies[this.editingIndex];
    const originalIndex = this.movies.indexOf(movieToEdit);

    if (originalIndex > -1) {
      this.movies[originalIndex] = {
        ...this.movies[originalIndex],
        title: this.editTitle,
        year: this.editYear!,
        poster: this.editPoster,
        description: this.editDescription
      };
    }

    this.filterMovies();
    this.cancelEdit();
  }

  // Cancel edit
  cancelEdit() {
    this.editingIndex = null;
    this.editTitle = '';
    this.editYear = null;
    this.editPoster = '';
    this.editDescription = '';
  }
}
