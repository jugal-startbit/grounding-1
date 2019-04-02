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
export class DepartmentService {
  url: string;
  constructor(private http: HttpClient, private commService: CommonService) {
    this.url = commService.getApiUrl() + '/department/';
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }
  getAllDepartments(): Observable<any> {
    return this.http.get(this.url + 'getAll').pipe(
      map(this.extractData));
  }

  getAllDepartmentsByID(selectedID): Observable<any> {
    return this.http.get(this.url + 'getAllDepartmentsByID/' + selectedID).pipe(
      map(this.extractData));
  }

  getOneDepartment(id): Observable<any> {
    return this.http.get(this.url + 'getOne/' + id).pipe(
      map(this.extractData));
  }

  addDepartment (data): Observable<any> {
    return this.http.post<any>(this.url + 'create', JSON.stringify(data), httpOptions).pipe(
      tap(( ) => console.log(`added department w/ id=${data._id}`)),
      catchError(this.handleError<any>('addDepartment'))
    );
  }

  updateDepartment (id, data): Observable<any> {
    return this.http.put<any>(this.url + 'update/' + id, JSON.stringify(data), httpOptions).pipe(
      tap(( ) => console.log(`updated department w/ id=${data._id}`)),
      catchError(this.handleError<any>('updateDepartment'))
    );
  }

  deleteDepartment (id): Observable<any> {
    return this.http.delete<any>(this.url + 'delete/' + id, httpOptions).pipe(
      tap(( ) => console.log(`deleted department w/ id=${id}`)),
      catchError(this.handleError<any>('deleteDepartment'))
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
