import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

import { User } from '../_models/user';
import { CommonService} from '../common.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    url: string;
    constructor(
      private http: HttpClient,
      private commService: CommonService,
      private router: Router,
      private snackBar: MatSnackBar
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
      this.url = this.commService.getApiUrl();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
      console.log('URL: ' + this.url);
        return this.http.post<any>(this.url + `/admin/login`, { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.clear();
        this.currentUserSubject.next(null);
    }
    checkSelectedComponentVisiblity(menuName) {
      const allMenus = JSON.parse(localStorage.getItem('VisibleMenus'));
      let index = allMenus.findIndex(x => x.name === menuName);
      if (index === -1) {
        for (const row of allMenus) {
          if (row.children) {
            index = row.children.findIndex(x => x.name === menuName);
            if (index !== -1) {
              break;
            }
          }
        }
      }
      if (index === -1) {
        this.snackBar.open('Sorry! You are not eligible to access this page, please contact to adminstrator', 'Warning', {
          duration: 5000,
          panelClass: ['warning-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/dashboard']);
      }
    }
}
