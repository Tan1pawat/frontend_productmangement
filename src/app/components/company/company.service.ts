import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTablesResponse } from '../../shared/datatable.types';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private _httpClient: HttpClient) { }

  getPage(dataTablesParameters: any): Observable<DataTablesResponse> {

    return this._httpClient
      .post(
        environment.baseURL + '/api/company_page',
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
        .delete<any>(environment.baseURL + '/api/company/'+id)
        .pipe(
          switchMap((response: any) => {
            return of(response.data);
          })
        );
  }
}
