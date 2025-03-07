import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Document } from '../../core/models';
import { selectAllDocuments, selectDocumentLoading } from '../../store/document/document.selectors';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-primary">📂 Document Dashboard</h2>
        <a routerLink="/upload" class="btn btn-success">
          <i class="bi bi-upload"></i> Upload New Document
        </a>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading$ | async" class="alert alert-info text-center">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Loading documents...</p>
      </div>

      <!-- No Documents Found -->
      <div *ngIf="!(loading$ | async) && (documents$ | async)?.length === 0" class="alert alert-warning text-center">
        <i class="bi bi-exclamation-triangle-fill"></i> No documents found. Start by uploading a document.
      </div>

      <!-- Document Table -->
      <div *ngIf="(documents$ | async)?.length" class="table-responsive">
        <table class="table table-bordered table-hover align-middle">
          <thead class="table-dark">
            <tr>
              <th>Title</th>
              <th>Verification Code</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Uploaded By</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let document of documents$ | async">
              <td>{{ document.title }}</td>
              <td><span class="text-monospace">{{ document.verificationCode }}</span></td>
              <td>
                <span class="badge" [ngClass]="{
                  'bg-success': document.status === 'Verified',
                  'bg-warning': document.status === 'Pending',
                  'bg-danger': document.status === 'Rejected'
                }">
                  {{ document.status }}
                </span>
              </td>
              <td>{{ document.createdAt | date:'medium' }}</td>
              <td>{{ document.uploadedBy }}</td>
              <td class="text-center">
                <a [routerLink]="['/documents', document.id]" class="btn btn-outline-primary btn-sm">
                  <i class="bi bi-eye"></i> View
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  documents$: Observable<Document[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store, private authService: AuthService) {
    this.documents$ = this.store.select(selectAllDocuments);
    this.loading$ = this.store.select(selectDocumentLoading);
  }

  ngOnInit(): void {}
}
