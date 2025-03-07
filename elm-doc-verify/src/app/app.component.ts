import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex flex-column min-vh-100 m-0 p-0">
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark ">
        <div class="container">
          <a class="navbar-brand" href="#">Elm Document Verification</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <a class="nav-link" routerLink="/dashboard">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/upload">Upload Document</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/verify">Verify Document</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="container my-5">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-dark text-white text-center py-3 mt-auto">
        <p class="mb-0">&copy; 2025 Elm Company | All Rights Reserved</p>
      </footer>
    </div>
  `,
})
export class AppComponent {
  title = 'Elm Document Verification System';
}
