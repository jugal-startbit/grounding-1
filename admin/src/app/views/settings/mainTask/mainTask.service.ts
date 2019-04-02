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
export class MainTaskService {
  url: string;
  constructor(private http: HttpClient, private commService: CommonService) {
    this.url = commService.getApiUrl() + '/mainTask/';
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }
  getAllMainTasks(): Observable<any> {
    return this.http.get(this.url + 'getAll').pipe(
      map(this.extractData));
  }

  getAllByTaskType(selectedTaskType): Observable<any> {
    return this.http.get(this.url + 'getAllByTaskType/' + selectedTaskType).pipe(
      map(this.extractData));
  }
  getAllByTask(): Observable<any> {
    return this.http.get(this.url + 'getAllByTask').pipe(
      map(this.extractData));
  }

  getOneTaskByID(id): Observable<any> {
    return this.http.get(this.url + 'getOneTaskByID/' + id).pipe(
      map(this.extractData));
  }
  getOneMainTask(id): Observable<any> {
    return this.http.get(this.url + 'getOne/' + id).pipe(
      map(this.extractData));
  }
  getAllByParentID(ParentID): Observable<any> {
    return this.http.get(this.url + 'getOneByParentID/' + ParentID).pipe(
      map(this.extractData));
  }

  addMainTask (data): Observable<any> {
    return this.http.post<any>(this.url + 'create', JSON.stringify(data), httpOptions).pipe(
      tap(( ) => console.log(`added mainTask w/ id=${data._id}`)),
      catchError(this.handleError<any>('addMainTask'))
    );
  }

  updateMainTask (id, data): Observable<any> {
    return this.http.put<any>(this.url + 'update/' + id, JSON.stringify(data), httpOptions).pipe(
      tap(( ) => console.log(`updated mainTask w/ id=${data._id}`)),
      catchError(this.handleError<any>('updateMainTask'))
    );
  }

  deleteMainTask (id): Observable<any> {
    return this.http.delete<any>(this.url + 'delete/' + id, httpOptions).pipe(
      tap(( ) => console.log(`deleted mainTask w/ id=${id}`)),
      catchError(this.handleError<any>('deleteMainTask'))
    );
  }

  getAllByDepartmentWithoutChild(selectedDepartmentID): Observable<any> {
    return this.http.get(this.url + 'getAllByDepartmentWithoutChild/' + selectedDepartmentID).pipe(
      map(this.extractData));
  }

  getAllChildTaskByParentID(selectedTaskID): Observable<any> {
    return this.http.get(this.url + 'getAllChildTaskByParentID/' + selectedTaskID).pipe(
      map(this.extractData));
  }

  getOneChildTask(id): Observable<any> {
    return this.http.get(this.url + 'getOne/' + id).pipe(
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
