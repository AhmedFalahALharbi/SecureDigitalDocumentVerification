import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { uploadDocument, resetUploadState } from '../../store/document/document.actions';
import { selectDocumentError, selectDocumentLoading, selectUploadSuccess } from '../../store/document/document.selectors';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-5">
  <h1 class="mb-4">Upload Document</h1>
  
  <div *ngIf="success" class="alert alert-success">
    Document uploaded successfully!
    <button (click)="navigateToDashboard()" class="btn btn-primary ml-3">Back to Dashboard</button>
  </div>
  
  <div *ngIf="error" class="alert alert-danger">
    Error: {{ error }}
  </div>
  
  <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()" *ngIf="!success">
    <div class="form-group">
      <label for="title">Document Title</label>
      <input type="text" id="title" formControlName="title" class="form-control">
      <div *ngIf="uploadForm.get('title')?.invalid && uploadForm.get('title')?.touched" class="text-danger">
        <span *ngIf="uploadForm.get('title')?.errors?.['required']">Title is required</span>
      </div>
    </div>
    
    <div class="form-group">
      <label for="file">Document File</label>
      <input type="file" id="file" (change)="onFileSelected($event)" class="form-control-file">
      <div *ngIf="uploadForm.get('fileSelected')?.invalid && uploadForm.get('fileSelected')?.touched" class="text-danger">
        <span *ngIf="uploadForm.get('fileSelected')?.errors?.['required']">File is required</span>
      </div>
    </div>
    
    <button type="submit" [disabled]="uploadForm.invalid || (loading$ | async)" class="btn btn-success">
      <span *ngIf="loading$ | async">Uploading...</span>
      <span *ngIf="!(loading$ | async)">Upload Document</span>
    </button>
    
    <button type="button" (click)="navigateToDashboard()" class="btn btn-secondary ml-2">Cancel</button>
  </form>
</div>

  `,
})
export class DocumentUploadComponent implements OnInit, OnDestroy {
  uploadForm: FormGroup;
  loading$: Observable<boolean>;
  error: string | null = null;
  success = false;
  selectedFile: File | null = null;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router,
    private authService: AuthService
  ) {
    this.uploadForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      fileSelected: [false, [Validators.requiredTrue]]
    });
    
    this.loading$ = this.store.select(selectDocumentLoading);
  }
  
  ngOnInit(): void {
    // Subscribe to success and error states
    this.store.select(selectUploadSuccess)
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        this.success = success;
      });
      
    this.store.select(selectDocumentError)
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.error = error;
      });
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.uploadForm.patchValue({ fileSelected: true });
    } else {
      this.selectedFile = null;
      this.uploadForm.patchValue({ fileSelected: false });
    }
  }
  
  onSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) {
      return;
    }
    
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.error = 'User not authenticated';
      return;
    }
    
    const documentData = {
      title: this.uploadForm.get('title')?.value,
      file: this.selectedFile,
      userId: user.id
    };
    
    this.store.dispatch(uploadDocument({ document: documentData }));
  }
  
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(resetUploadState());
  }
}