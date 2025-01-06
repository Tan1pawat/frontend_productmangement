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

  created(data:any): Observable<any> {
    return this._httpClient
    .post(
      environment.baseURL + '/api/bill',
      data
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
        .delete<any>(environment.baseURL + '/api/bill/'+id)
        .pipe(
          switchMap((response: any) => {
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

  downloadFile(billId: number, endpoint: string): void {
    const url = `${environment.baseURL}/api/${endpoint}/${billId}`; // Adjust API path based on your routes

    this._httpClient.get(url, { responseType: 'blob', observe: 'response' }).subscribe(
      (response) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = 'download.xlsx'; // Default file name

        // Extract file name from Content-Disposition header
        if (contentDisposition && contentDisposition.includes('filename')) {
          const matches = contentDisposition.match(/filename="(.+)"/);
          if (matches && matches[1]) {
            fileName = decodeURIComponent(matches[1]);
          }
        }

        // Create a blob URL and download the file
        const blob = new Blob([response.body!], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading file:', error);
      }
    );
  }
}
