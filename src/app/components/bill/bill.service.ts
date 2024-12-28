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
}
