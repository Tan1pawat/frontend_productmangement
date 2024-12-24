import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, of, switchMap } from 'rxjs';
import { DataTablesResponse } from '../../shared/datatable.types';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _httpClient: HttpClient) { }

  getPage(dataTablesParameters: any): Observable<DataTablesResponse> {
    console.log("test get page");
    
    return this._httpClient
      .post(
        environment.baseURL + '/api/product_page',
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
