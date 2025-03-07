import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'upload', 
    loadComponent: () => import('./components/document-upload/document-upload.component').then(m => m.DocumentUploadComponent) 
  },
  { 
    path: 'verify', 
    loadComponent: () => import('./components/verification/verification.component').then(m => m.VerificationComponent) 
  },
  { 
    path: '**', 
    redirectTo: 'dashboard' 
  }
];