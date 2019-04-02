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
export class WorkExistingService {
  url: string;
  urlWorkExisting: string;
  currentUser: any;
  constructor(private http: HttpClient, private commService: CommonService) {
    this.url = commService.getApiUrl() + '/clientWork/';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  addClientWork (clientWorkData): Observable<any> {
    clientWorkData.AssignBy = this.currentUser.id;
    return this.http.post<any>(this.url + 'createExisting',
      JSON.stringify({ClientWorkData: clientWorkData}), httpOptions).pipe(
      tap(( ) => console.log(`added entry`)),
      catchError(this.handleError<any>('addClient'))
    );
  }

  getAllByExisting(selectedDepartmentID): Observable<any> {
    return this.http.get(this.url + 'getAllByExisting/' + selectedDepartmentID).pipe(
      map(this.extractData));
  }

  getAllWorkByClient(ClientID): Observable<any> {
    return this.http.get(this.url + 'getAllWorkByClient/' + ClientID).pipe(
      map(this.extractData));
  }

  getAllByClientFirm(ID): Observable<any> {
    return this.http.get(this.url + 'getAllByClientFirm/' + ID).pipe(
      map(this.extractData));
  }

  getAllWorkByEmployee(selectedEmployeeID): Observable<any> {
    return this.http.get(this.url + 'getAllWorkByEmployee/' + selectedEmployeeID).pipe(
      map(this.extractData));
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
