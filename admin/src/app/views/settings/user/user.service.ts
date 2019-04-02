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
export class UserService {
  url: string;
  constructor(private http: HttpClient, private commService: CommonService) {
    this.url = commService.getApiUrl() + '/user/';
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }
  getAllUsers(selectedLeaderID): Observable<any> {
    return this.http.get(this.url + 'getAll/' + selectedLeaderID).pipe(
      map(this.extractData));
  }

  getOneUser(id): Observable<any> {
    return this.http.get(this.url + 'getOne/' + id).pipe(
      map(this.extractData));
  }

  addUser (data): Observable<any> {
    return this.http.post<any>(this.url + 'create', JSON.stringify(data), httpOptions).pipe(
      tap(( ) => console.log(`added user w/ id=${data._id}`)),
      catchError(this.handleError<any>('addUser'))
    );
  }

  updateUser (id, data): Observable<any> {
    return this.http.put<any>(this.url + 'update/' + id, JSON.stringify(data), httpOptions).pipe(
      tap(( ) => console.log(`updated user w/ id=${data._id}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  deleteUser (id): Observable<any> {
    return this.http.delete<any>(this.url + 'delete/' + id, httpOptions).pipe(
      tap(( ) => console.log(`deleted user w/ id=${id}`)),
      catchError(this.handleError<any>('deleteUser'))
    );
  }
  getAllUserByDepartment(selectedDepartmentID): Observable<any> {
    return this.http.get(this.url + 'getAllUserByDepartment/' + selectedDepartmentID).pipe(
      map(this.extractData));
  }

  getAllUserByDepartmentWithLeader(selectedDepartmentID): Observable<any> {
    return this.http.get(this.url + 'getAllUserByDepartmentWithLeader/' + selectedDepartmentID).pipe(
      map(this.extractData));
  }

  getAllUserByLeader(selectedLeaderID): Observable<any> {
    return this.http.get(this.url + 'getAllUserByLeader/' + selectedLeaderID).pipe(
      map(this.extractData));
  }

  getAllUserByRoleAndDepartment(selectedDepartmentID): Observable<any> {
    return this.http.get(this.url + 'getAllUserByRoleAndDepartment/' + selectedDepartmentID).pipe(
      map(this.extractData));
  }
  getAllUserForLeaderAssign(selectedDepartmentID, selectedRole): Observable<any> {
    return this.http.get(this.url + 'getAllUserForLeaderAssign/' + selectedDepartmentID + '/' + selectedRole).pipe(
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
