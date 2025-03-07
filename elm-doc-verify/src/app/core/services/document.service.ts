import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document, DocumentUpload, VerificationResult } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  uploadDocument(documentData: DocumentUpload): Observable<Document> {
    // Create form data for file upload
    const formData = new FormData();
    formData.append('title', documentData.title);
    formData.append('file', documentData.file);
    formData.append('userId', documentData.userId.toString());

    return this.http.post<Document>(`${this.apiUrl}/documents`, formData);
  }

  getDocument(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/documents/${id}`);
  }

  verifyDocument(verificationCode: string, verifiedBy: string = 'Anonymous'): Observable<VerificationResult> {
    return this.http.post<VerificationResult>(`${this.apiUrl}/verify`, {
      verificationCode,
      verifiedBy
    });
  }
}