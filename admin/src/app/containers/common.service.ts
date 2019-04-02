import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }
  private extractData(res: Response) {
    let body = res;
    return body || { };
  }
  getApiUrl() {
    //return 'http://192.168.1.21:5006';
    return 'https://grounding.herokuapp.com';
  }
  playNotification() {
    const audio = new Audio();
    audio.src = '../../assets/mp3/notification.mp3';
    audio.load();
    audio.play();
  }
  getAllMenuByRoles(id): Observable<any> {
    return this.http.get(this.getApiUrl() + '/menu/getAllMenuByRoles/' + id).pipe(
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
