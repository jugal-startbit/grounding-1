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
export class WorkListService {
  url: string;
  urlStatus: string;
  currentUser: any;
  constructor(private http: HttpClient, private commService: CommonService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.url = commService.getApiUrl() + '/clientWork/';
    this.urlStatus = commService.getApiUrl() + '/status/';
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getAllWork(status, employee, department): Observable<any> {
    return this.http.get(this.url + 'getAllWork/' + status + '/'  + employee + '/' + department).pipe(
      map(this.extractData));
  }

  getAllWorkByEmployeeLeader(status, employee, leader): Observable<any> {
    return this.http.get(this.url + 'getAllWorkByEmployeeLeader/' + status + '/'  + employee + '/' + leader).pipe(
      map(this.extractData));
  }

  getAllWorkByEmployeePerformance (status, employee, leader, value): Observable<any> {
    return this.http.post<any>(this.url + 'getAllWorkByEmployeePerformance',
      JSON.stringify({status: status, employee: employee, leader: leader, value: value}), httpOptions).pipe(
      tap(( ) => console.log(`get employee status`)),
      catchError(this.handleError<any>('get employee status'))
    );
  }

  getAllStatus(): Observable<any> {
    return this.http.get(this.urlStatus + 'getAll').pipe(
      map(this.extractData));
  }

  getAllWorkByDueAmount(): Observable<any> {
    return this.http.get(this.url + 'getAllWorkByDueAmount').pipe(
      map(this.extractData));
  }

  getAllWorkByDueAmountByFilter(filter, client): Observable<any> {
    return this.http.get(this.url + 'getAllWorkByDueAmountByFilter/' + filter + '/' + client).pipe(
      map(this.extractData));
  }

  getAllWorkByDueAmountWithFilter(data): Observable<any> {
    return this.http.post<any>(this.url + 'getAllWorkByDueAmountWithFilter', JSON.stringify(data), httpOptions).pipe(
      tap(( ) => console.log(`get payment`)),
      catchError(this.handleError<any>('error'))
    );
  }

  getAllWorkByFilter(data): Observable<any> {
    return this.http.post<any>(this.url + 'getAllWorkByFilter',
      JSON.stringify(data), httpOptions).pipe(
      tap(( ) => console.log(`getAllWorkByFilter`)),
      catchError(this.handleError<any>('error'))
    );
  }

  getOneWork(id): Observable<any> {
    return this.http.get(this.url + 'getOne/' + id).pipe(
      map(this.extractData));
  }

  getAllPaymentReminderByWork(id): Observable<any> {
    return this.http.get(this.url + 'getAllPaymentReminderByWork/' + id).pipe(
      map(this.extractData));
  }

  createPaymentReminder (work, description): Observable<any> {
    work.Description = description;
    work.ModifiedBy = this.currentUser.id;
    return this.http.post<any>(this.url + 'createPaymentReminder',
      JSON.stringify({data: work}), httpOptions).pipe(
      tap(( ) => console.log(`createPaymentReminder`)),
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
