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
export class LeaderService {
  url: string;
  constructor(private http: HttpClient, private commService: CommonService) {
    this.url = commService.getApiUrl() + '/user/';
  }
  updateSelectedEmployeeLeader(selectedEmployee, LeaderID): Observable<any> {
    return this.http.put(this.url + 'updateSelectedEmployeeLeader/' + LeaderID, {Employee: selectedEmployee}).pipe(
      map(this.extractData));
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
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
