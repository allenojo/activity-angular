import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // ✅ Import RouterModule

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,   // ✅ Para sa common directives
    FormsModule,    // ✅ Para sa ngModel
    RouterModule    // ✅ Para sa routerLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  message: string = '';

  constructor(private router: Router) {}

  register() {
    if (!this.username || !this.password || !this.confirmPassword) {
      this.message = 'Please fill all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.find((u: any) => u.username === this.username)) {
      this.message = 'Username already exists';
      return;
    }

    users.push({ username: this.username, password: this.password });
    localStorage.setItem('users', JSON.stringify(users));

    this.message = 'Registration successful!';
    setTimeout(() => this.router.navigate(['/login']), 1500);
  }
}
