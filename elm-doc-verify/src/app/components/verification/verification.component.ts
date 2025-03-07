import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { verifyDocument, resetDocumentState } from '../../store/document/document.actions';
import { selectDocumentError, selectDocumentLoading, selectSelectedDocument } from '../../store/document/document.selectors';
import { Document, VerificationResult } from '../../core/models';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
   <div class="container mt-5">
  <h1 class="mb-4">Verify Document</h1>
  
  <div *ngIf="loading$ | async" class="alert alert-info">
    Verifying...
  </div>
  
  <div *ngIf="error" class="alert alert-danger">
    Error: {{ error }}
  </div>
  
  <div *ngIf="verifiedDocument" class="alert alert-success">
    <h2>Document Verified Successfully!</h2>
    <div>
      <p><strong>Title:</strong> {{ verifiedDocument.title }}</p>
      <p><strong>Verification Code:</strong> {{ verifiedDocument.verificationCode }}</p>
      <p><strong>Status:</strong> {{ verifiedDocument.status }}</p>
      <p><strong>Created:</strong> {{ verifiedDocument.createdAt | date:'medium' }}</p>
      <p><strong>Uploaded By:</strong> {{ verifiedDocument.uploadedBy }}</p>
    </div>
  </div>
  
  <form [formGroup]="verificationForm" (ngSubmit)="onSubmit()" *ngIf="!verifiedDocument">
    <div class="form-group">
      <label for="verificationCode">Verification Code</label>
      <input type="text" id="verificationCode" formControlName="verificationCode" class="form-control">
      <div *ngIf="verificationForm.get('verificationCode')?.invalid && verificationForm.get('verificationCode')?.touched" class="text-danger mt-2">
        <span *ngIf="verificationForm.get('verificationCode')?.errors?.['required']">Verification code is required</span>
      </div>
    </div>
    
    <button type="submit" [disabled]="verificationForm.invalid || (loading$ | async)" class="btn btn-primary">
      Verify Document
    </button>
  </form>
</div>

  `,
})
export class VerificationComponent implements OnDestroy {
  verificationForm: FormGroup;
  loading$: Observable<boolean>;
  error: string | null = null;
  verifiedDocument: Document | null = null;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private formBuilder: FormBuilder,
    private store: Store
  ) {
    this.verificationForm = this.formBuilder.group({
      verificationCode: ['', [Validators.required]]
    });
    
    this.loading$ = this.store.select(selectDocumentLoading);
    
    this.store.select(selectSelectedDocument)
      .pipe(takeUntil(this.destroy$))
      .subscribe(document => {
        this.verifiedDocument = document || null;
      });
      
    this.store.select(selectDocumentError)
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.error = error;
      });
  }
  
  onSubmit(): void {
    if (this.verificationForm.invalid) {
      return;
    }
    
    const verificationCode = this.verificationForm.get('verificationCode')?.value;
    
    this.store.dispatch(verifyDocument({ 
      verificationCode,
      verifiedBy: 'Anonymous' 
    }));
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(resetDocumentState());
  }
}