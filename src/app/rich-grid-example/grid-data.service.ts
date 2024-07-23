import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface GridRow {
  CallId: string,
  RecordingState: string,
  TranscodingState: string,
  ArchivalState: string,
  ReconciliationState: string
}

@Injectable({
  providedIn: 'root'
})

export class GridDataService {

  private apiUrl = 'https://localhost:7020/api/actionhandler'; // Update the URL to your API endpoint

  constructor(private http: HttpClient) { }

  getGridData(): Observable<GridRow[]> {
    let gridData$: Observable<GridRow[]>;
    gridData$ = this.http.get<GridRow[]>(this.apiUrl).pipe(
      catchError((error: any) => {
        console.error('Error fetching grid data:', error);
        return throwError('Failed to fetch grid data');
      })
    );
    return gridData$;
  }
}
