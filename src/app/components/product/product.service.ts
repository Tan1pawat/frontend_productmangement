import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of, switchMap, tap } from 'rxjs';
import { DataTablesResponse } from '../../shared/datatable.types';
import { Product } from '../../shared/product.types';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _httpClient: HttpClient) { }

  getPage(dataTablesParameters: any): Observable<DataTablesResponse> {

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

  create(data: FormData): Observable<any> {
    return this._httpClient
        .post<any>(environment.baseURL + '/api/product', data)
        .pipe(
          switchMap((response: any) => {
            return of(response.data);
          })
        );
}

update(data: any,id:any): Observable<any> {
  return this._httpClient
      .put<any>(environment.baseURL + '/api/product/'+id, data)
      .pipe(
        switchMap((response: any) => {
          return of(response.data);
        })
      );
}

delete(id: number): Observable<any> {
  return this._httpClient
      .delete<any>(environment.baseURL + '/api/product/'+id)
      .pipe(
        switchMap((response: any) => {
          return of(response.data);
        })
      );
}

getproductById(id:number): Observable<Product> {
  return this._httpClient.get<any[]>(
    environment.baseURL + '/api/product/' + id
  ).pipe(
    switchMap((response: any) => {
      return of(response.data);
    })
  );
}

getlist(): Observable<any[]> {
  return this._httpClient.get<any[]>(
    environment.baseURL + '/api/get_product'
  ).pipe(
    switchMap((response: any) => {
      return of(response.data);
    })
  );
}

  uploadImg(img: FormData): Observable<any> {
    return this._httpClient
      .post(
        environment.baseURL + '/api/upload_product_image',
        img,
      )
      .pipe(
        switchMap((response: any) => {
          return of(response.data);
        })
      );
  }

  getproductTypes(): Observable<any[]> {
    return this._httpClient.get<any[]>(
      environment.baseURL + '/api/get_product_type'
    ).pipe(
      switchMap((response: any) => {
        return of(response.data);
      })
    );
  }

  getunit(): Observable<any[]> {
    return this._httpClient.get<any[]>(
      environment.baseURL + '/api/get_unit'
    ).pipe(
      switchMap((response: any) => {
        return of(response.data);
      })
    );
  }

}
