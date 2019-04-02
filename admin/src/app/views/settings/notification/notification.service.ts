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
export class NotificationService {
  url: string;
  constructor(private http: HttpClient, private commService: CommonService) {
    this.url = commService.getApiUrl() + '/notification/';
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getAllNotification(): Observable<any> {
    return this.http.get(this.url + 'getAll').pipe(
      map(this.extractData));
  }

  getByEmployeeID(id): Observable<any> {
    return this.http.get(this.url + 'getByEmployeeID/' + id).pipe(
      map(this.extractData));
  }

  readNotification(id): Observable<any> {
    return this.http.get(this.url + 'readNotification/' + id).pipe(
      map(this.extractData));
  }

  updateAllNotificationByEmployee(EmployeeID): Observable<any> {
    return this.http.get(this.url + 'updateAllNotificationByEmployee/' + EmployeeID).pipe(
      map(this.extractData));
  }

  addNotification (data): Observable<any> {
    return this.http.post<any>(this.url + 'create', JSON.stringify(data), httpOptions).pipe(
      tap(( ) => console.log(`added mainTask w/ id=${data._id}`)),
      catchError(this.handleError<any>('addMainTask'))
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
