import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { DataTablesResponse } from '../../shared/datatable.types';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private _httpClient: HttpClient) { }

  getPage(dataTablesParameters: any): Observable<DataTablesResponse> {
    console.log(dataTablesParameters);
    
    return this._httpClient
      .post(
        environment.baseURL + '/api/bill_page',
        dataTablesParameters
      )
      .pipe(
        switchMap((response: any) => {
          console.log(response);

          return of(response.data);
        })
      );
  }

  getprisons(): Observable<any[]> {
    return this._httpClient.get<any[]>(
      environment.baseURL + '/api/get_prison'
    ).pipe(
      switchMap((response: any) => {
        return of(response.data);
      })
    );
  }

  getcompanies(): Observable<any[]> {
    return this._httpClient.get<any[]>(
      environment.baseURL + '/api/get_company'
    ).pipe(
      switchMap((response: any) => {
        return of(response.data);
      })
    );
  }
}
