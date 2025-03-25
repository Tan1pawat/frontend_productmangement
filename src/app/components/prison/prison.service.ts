import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTablesResponse } from '../../shared/datatable.types';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrisonService {


  constructor(private _httpClient: HttpClient) { }

  getPage(dataTablesParameters: any): Observable<DataTablesResponse> {

    return this._httpClient
      .post(
        environment.baseURL + '/api/prison_page',
        dataTablesParameters
      )
      .pipe(
        switchMap((response: any) => {
          console.log(response);

          return of(response.data);
        })
      );
  }

  delete(id: number): Observable<any> {
    return this._httpClient
      .delete<any>(environment.baseURL + '/api/prison/' + id)
      .pipe(
        switchMap((response: any) => {
          return of(response.data);
        })
      );
  }

  create(data: FormData): Observable<any> {
    return this._httpClient
      .post<any>(environment.baseURL + '/api/prison', data)
      .pipe(
        switchMap((response: any) => {
          return of(response.data);
        })
      );
  }

  getPrisonById(id: number): Observable<any> {
    return this._httpClient
      .get<any>(environment.baseURL + '/api/prison/' + id)
      .pipe(
        switchMap((response: any) => {
          return of(response.data);
        })
      );
  }

  update(id: number, data: any): Observable<any> {
    return this._httpClient
      .put<any>(environment.baseURL + '/api/prison/' + id, data)
      .pipe(
        switchMap((response: any) => {
          return of(response.data);
        })
      );
  }
}
