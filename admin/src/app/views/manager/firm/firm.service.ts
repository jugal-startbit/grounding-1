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
export class FirmService {
  url: string;
  urlFirm: string;
  urlFirmDoc: string;
  currentUser: any;
  constructor(private http: HttpClient, private commService: CommonService) {
    this.url = commService.getApiUrl() + '/clientFirm/';
    this.urlFirm = commService.getApiUrl() + '/firmType/';
    this.urlFirmDoc = commService.getApiUrl() + '/firmDocument/';
    this.currentUser = localStorage.getItem('currentUser');
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  addFirmKeyPerson (firmData, keyPersonData, companyData, selectedFirmType): Observable<any> {
    return this.http.post<any>(this.url + 'createFirmKeyPerson',
      JSON.stringify({FirmData: firmData, KeyPersonData: keyPersonData, CompanyData: companyData, FirmType: selectedFirmType}), httpOptions).pipe(
      tap(( ) => console.log(`added entry w/ id=${firmData.Name}`)),
      catchError(this.handleError<any>('addFirm'))
    );
  }

  getAllFirmTypes(): Observable<any> {
    return this.http.get(this.urlFirm + 'getAll').pipe(
      map(this.extractData));
  }

  getAllCompanyDocuments(selectedFirmType): Observable<any> {
    return this.http.get(this.urlFirmDoc + 'getAll/' + selectedFirmType).pipe(
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
