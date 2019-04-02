import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map, catchError, tap} from 'rxjs/operators';

import {CommonService} from '../../../containers/common.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class WorkNewService {
  url: string;
  urlWorkNew: string;
  currentUser: any;

  constructor(private http: HttpClient, private commService: CommonService) {
    this.url = commService.getApiUrl() + '/clientWork/';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  addClientWork(EmployeeID, ClientID, clientWorkData): Observable<any> {
    return this.http.post<any>(this.url + 'create',
      JSON.stringify({EmployeeID: EmployeeID, ClientID: ClientID, ClientWorkData: clientWorkData}), httpOptions).pipe(
      tap(() => console.log(`added entry w/ id=${EmployeeID}`)),
      catchError(this.handleError<any>('addClient'))
    );
  }

  private handleError<T>(operation = 'operation', result?: any) {
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
