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
export class ClientService {
  url: string;
  urlFirm: string;
  constructor(private http: HttpClient, private commService: CommonService) {
    this.url = commService.getApiUrl() + '/client/';
    this.urlFirm = commService.getApiUrl() + '/clientFirm/';
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }
  getAllClients(): Observable<any> {
    return this.http.get(this.url + 'getAll').pipe(
      map(this.extractData));
  }

  getOneClient(id): Observable<any> {
    return this.http.get(this.url + 'getOne/' + id).pipe(
      map(this.extractData));
  }

  getOneFirm(id): Observable<any> {
    return this.http.get(this.urlFirm + 'getOne/' + id).pipe(
      map(this.extractData));
  }

  addClient (data, firms): Observable<any> {
    return this.http.post<any>(this.url + 'create', JSON.stringify({data: data, firms: firms}), httpOptions).pipe(
      tap(( ) => console.log(`added client w/ id=${data._id}`)),
      catchError(this.handleError<any>('addClient'))
    );
  }

  updateClient (id, data, firms): Observable<any> {
    return this.http.put<any>(this.url + 'update/' + id, JSON.stringify({data: data, firms: firms}), httpOptions).pipe(
      tap(( ) => console.log(`updated client w/ id=${data._id}`)),
      catchError(this.handleError<any>('updateClient'))
    );
  }

  deleteClient (id): Observable<any> {
    return this.http.delete<any>(this.url + 'delete/' + id, httpOptions).pipe(
      tap(( ) => console.log(`deleted client w/ id=${id}`)),
      catchError(this.handleError<any>('deleteClient'))
    );
  }

  getAllFirms(id): Observable<any> {
    return this.http.get(this.urlFirm + 'getAll/' + id).pipe(
      map(this.extractData));
  }

  deleteFirm (id): Observable<any> {
    return this.http.delete<any>(this.urlFirm + 'delete/' + id, httpOptions).pipe(
      tap(( ) => console.log(`deleted client firm w/ id=${id}`)),
      catchError(this.handleError<any>('deleteClientFirm'))
    );
  }
  getAllClientsByFilterValue(data): Observable<any> {
    return this.http.post<any>(this.url + 'getAllClientsByFilterValue', JSON.stringify({data: data}), httpOptions).pipe(
      tap(( ) => console.log(`added client w/ id=${data._id}`)),
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
