import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { CommonService} from '../../../containers/common.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class EntryService {
  url: string;
  constructor(private http: HttpClient, private commService: CommonService) {
    this.url = commService.getApiUrl() + '/payments/';
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getAllPayments(): Observable<any> {
    return this.http.get(this.url + 'getAll').pipe(
      map(this.extractData));
  }

  getAllPaymentsByDateAndClient(date, selectedClientID): Observable<any> {
    return this.http.get(this.url + 'getAllPaymentsByDateAndClient/' + date + '/' + selectedClientID).pipe(
      map(this.extractData));
  }

  getAllPaymentsByFilter(data): Observable<any> {
    return this.http.post<any>(this.url + 'getAllPaymentsByFilter', JSON.stringify(data), httpOptions).pipe(
      tap(( ) => console.log(`get payment`)),
      catchError(this.handleError<any>('error'))
    );
  }

  getOnePayment(id): Observable<any> {
    return this.http.get(this.url + 'getOne/' + id).pipe(
      map(this.extractData));
  }

  addPayment (data): Observable<any> {
    return this.http.post<any>(this.url + 'create', JSON.stringify(data), httpOptions).pipe(
      tap(( ) => console.log(`added payment w/ id=${data._id}`)),
      catchError(this.handleError<any>('error'))
    );
  }

  private handleError<T> (operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      const errorData = {
        status: false,
        message: 'Server Error'
      };
      // Let the app keep running by returning an empty result.
      return of(errorData);
    };
  }
}
