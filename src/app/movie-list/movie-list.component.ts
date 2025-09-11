import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent {
  movies = [
    { id: 1, title: 'Inception', year: 2010, poster: 'https://m.media-amazon.com/images/I/51s+8A6H0xL._AC_.jpg', description: 'A thief enters dreams to steal secrets.' },
    { id: 2, title: 'Interstellar', year: 2014, poster: 'https://m.media-amazon.com/images/I/71n58Tw4mEL._AC_SY679_.jpg', description: 'A team travels through a wormhole in search of a new home.' },
    { id: 3, title: 'The Dark Knight', year: 2008, poster: 'https://m.media-amazon.com/images/I/51k0qa6zY-L._AC_.jpg', description: 'Batman faces the Joker in Gotham.' },
    { id: 4, title: 'Avengers: Endgame', year: 2019, poster: 'https://m.media-amazon.com/images/I/81ExhpBEbHL._AC_SY679_.jpg', description: 'The Avengers assemble to defeat Thanos once and for all.' }
  ];

  constructor(private router: Router) {}

  goToDetails(id: number) {
    this.router.navigate(['/movie-details', id]); // ✅ Navigate to details page
  }
}
