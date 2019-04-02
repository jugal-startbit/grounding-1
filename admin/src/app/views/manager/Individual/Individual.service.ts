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
export class IndividualService {
  url: string;
  currentUser: any;
  constructor(private http: HttpClient, private commService: CommonService) {
    this.url = commService.getApiUrl() + '/client/';
    this.currentUser = localStorage.getItem('currentUser');
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  addIndividualClient (clientData, documentData, bankData, referenceData, chequeData): Observable<any> {
    return this.http.post<any>(this.url + 'createIndividualClient',
      JSON.stringify({Basic: clientData, Document: documentData, Bank: bankData, Reference: referenceData, Cheque: chequeData}), httpOptions).pipe(
      tap(( ) => console.log(`added entry w/ id=${clientData._id}`)),
      catchError(this.handleError<any>('addClient'))
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
