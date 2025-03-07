import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // In a real app, this would come from a backend auth system
  // For this demo, we'll use a mock user
  private currentUserSubject = new BehaviorSubject<User | null>({
    id: 1,
    name: 'Admin User',
    email: 'admin@elm.sa',
    role: 'Admin'
  });

  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // In a real app, these methods would communicate with a backend auth API
  login(email: string, password: string): Observable<User> {
    // Mock login implementation
    const mockUser = {
      id: 1,
      name: 'Admin User',
      email: 'admin@elm.sa',
      role: 'Admin'
    };

    this.currentUserSubject.next(mockUser);
    return of(mockUser);
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }
}