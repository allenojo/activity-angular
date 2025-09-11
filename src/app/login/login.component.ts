import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // ✅ Import RouterModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,  // ✅ kailangan para sa common directives
    FormsModule,   // ✅ kailangan para sa ngModel
    RouterModule   // ✅ kailangan para sa routerLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  message: string = '';

  constructor(private router: Router) {}

  login() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === this.username && u.password === this.password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.router.navigate(['/movies']);
    } else {
      this.message = 'Invalid username or password';
    }
  }
}
