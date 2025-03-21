import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _httpClient: HttpClient) { }

    getdashboard(data: any): Observable<any> {
      return this._httpClient.post<any[]>(
        environment.baseURL + '/api/dashboard',
        data
      ).pipe(
        switchMap((response: any) => {
          return of(response.data);
        })
      );
    }
}
