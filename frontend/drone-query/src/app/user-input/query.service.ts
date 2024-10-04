import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  constructor(private http: HttpClient) {}

  submitQuery(query: string): Observable<{ response: string }> {
    return this.http.post<{ response: string }>('/process-query/', { query });
  }
}
