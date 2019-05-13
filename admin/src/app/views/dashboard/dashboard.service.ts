import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { CommonService} from '../../containers/common.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  url: string;
  reviewUrl: string;
  urlClientWork: string;
  currentUser: any;
  constructor(private http: HttpClient, private commService: CommonService) {
    this.url = commService.getApiUrl() + '/events/';
    this.reviewUrl = commService.getApiUrl();
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }
  getAllDashboardEvents(): Observable<any> {
    return this.http.get(this.url + 'getAllDashboard/').pipe(
      map(this.extractData));
  }
  getAllDashboardEventsByFilter(data): Observable<any> {
    return this.http.post<any>(this.url + 'getAllDashboardByFilter/' , JSON.stringify(data) , httpOptions).pipe(
      map(this.extractData));
  }

  getAllLoginEvents(): Observable<any> {
    return this.http.get(this.url + 'getAllLogin/').pipe(
      map(this.extractData));
  }
  getAllLoginEventsByFilter(data): Observable<any> {
    return this.http.post<any>(this.url + 'getAllLoginByFilter/' , JSON.stringify(data) , httpOptions).pipe(
      map(this.extractData));
  }


  getAllAboutUsEvents(): Observable<any> {
    console.log("Event")
    return this.http.get(this.url + 'getAllAboutUs/').pipe(
      map(this.extractData));
  }
  getAllAboutUsByFilter(data): Observable<any> {
    return this.http.post<any>(this.url + 'getAllAboutUsByFilter/' , JSON.stringify(data) , httpOptions).pipe(
      map(this.extractData));
  }

  getAllContactUsEvents(): Observable<any> {
    return this.http.get(this.url + 'getAllContactUs/').pipe(
      map(this.extractData));
  }
  getAllContactUsByFilter(data): Observable<any> {
    return this.http.post<any>(this.url + 'getAllContactUsByFilter/' , JSON.stringify(data) , httpOptions).pipe(
      map(this.extractData));
  }


  getAllAboutGroungingLogEvents(): Observable<any> {
    return this.http.get(this.url + 'getAllAboutGroundingLog/').pipe(
      map(this.extractData));
  }
  getAllAboutGroungingLogByFilter(data): Observable<any> {
    return this.http.post<any>(this.url + 'getAllAboutGroungingLogByFilter/' , JSON.stringify(data) , httpOptions).pipe(
      map(this.extractData));
  }


  getAllLogoutEvents(): Observable<any> {
    return this.http.get(this.url + 'getAllLogout/').pipe(
      map(this.extractData));
  }
  getAllLogoutByFilter(data): Observable<any> {
    return this.http.post<any>(this.url + 'getAllLogoutByFilter/' , JSON.stringify(data) , httpOptions).pipe(
      map(this.extractData));
  }

  getAllPdfEvents(): Observable<any> {
    return this.http.get(this.url + 'getAllPdf/').pipe(
      map(this.extractData));
  }
  getAllPdfByFilter(data): Observable<any> {
    return this.http.post<any>(this.url + 'getAllPdfByFilter/' , JSON.stringify(data) , httpOptions).pipe(
      map(this.extractData));
  }

  getAllReview(): Observable<any> {
    return this.http.get(this.url + 'getAllReview').pipe(
      map(this.extractData));
  }
  getAllReviewByFilter(data): Observable<any> {
    return this.http.post<any>(this.url + 'getAllReviewByFilter/' , JSON.stringify(data) , httpOptions).pipe(
      map(this.extractData));
  }
  getAllUser(): Observable<any> {
    return this.http.get(this.url + 'getAllUser').pipe(
      map(this.extractData));
  }
  getAllUserByFilter(data): Observable<any> {
    return this.http.post<any>(this.url + 'getAllUserByFilter/' , JSON.stringify(data) , httpOptions).pipe(
      map(this.extractData));
  }
  deleteUser(id): Observable<any> {
    return this.http.delete<any>(this.url + 'deleteUser/' + id, httpOptions).pipe(
      tap(() => console.log(`deleted department w/ id=${id}`)),
      catchError(this.handleError<any>('deleteUser'))
    );
  }
  addUser(data): Observable<any> {
    return this.http.post<any>(this.url + 'createUser/' , JSON.stringify(data) , httpOptions).pipe(
      map(this.extractData));
  }
  editUser(id,data): Observable<any> {
    return this.http.put<any>(this.url + 'editUser/' + id, JSON.stringify(data) , httpOptions).pipe(
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
