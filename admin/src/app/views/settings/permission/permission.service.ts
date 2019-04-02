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
export class PermissionService {
  url: string;
  constructor(private http: HttpClient, private commService: CommonService) {
    this.url = commService.getApiUrl() + '/menu/';
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }
  getAllByRoles(): Observable<any> {
    return this.http.get(this.url + 'getAllByRoles').pipe(
      map(this.extractData));
  }

  getAll(id): Observable<any> {
    return this.http.get(this.url + 'getAll/' + id).pipe(
      map(this.extractData));
  }

  getOnePermission(id): Observable<any> {
    return this.http.get(this.url + 'getOne/' + id).pipe(
      map(this.extractData));
  }

  addPermission (data): Observable<any> {
    return this.http.post<any>(this.url + 'create', JSON.stringify(data), httpOptions).pipe(
      tap(( ) => console.log(`added permission w/ id=${data._id}`)),
      catchError(this.handleError<any>('addPermission'))
    );
  }

  updatePermission (id, data): Observable<any> {
    return this.http.put<any>(this.url + 'update/' + id, JSON.stringify(data), httpOptions).pipe(
      tap(( ) => console.log(`updated permission w/ id=${data._id}`)),
      catchError(this.handleError<any>('updatePermission'))
    );
  }

  deletePermission (id): Observable<any> {
    return this.http.delete<any>(this.url + 'delete/' + id, httpOptions).pipe(
      tap(( ) => console.log(`deleted permission w/ id=${id}`)),
      catchError(this.handleError<any>('deletePermission'))
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
