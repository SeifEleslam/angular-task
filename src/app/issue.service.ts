import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Issue } from './models/issue.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  private apiUrl = 'http://localhost:3000/issues';

  constructor(private http: HttpClient) {}

  getIssues(params?: any): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.apiUrl, { params });
  }

  updateIssueStatus(issue: Issue): Observable<Issue> {
    // Implement the API call to update the issue status.
    return this.http.patch<Issue>(`${this.apiUrl}/${issue.id}`, {
      status: issue.status,
    });
  }

  createIssue(issue: Omit<Issue, 'id'>): Observable<any> {
    return this.http.post<any>(this.apiUrl, issue);
  }
}
