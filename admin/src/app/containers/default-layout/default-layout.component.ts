import {Component, OnDestroy} from '@angular/core';
import { navItems } from '../../_nav';
import { Router, NavigationStart } from '@angular/router';
import { MatDialog, MatDialogRef  } from '@angular/material';
import { AuthenticationService } from '../_services/authentication.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CommonService} from '../common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnDestroy {
  public navItems = navItems;
  public dynamicNavItems: any = [];
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  public currentYear = (new Date()).getFullYear();
  private localStorage: any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    public http: HttpClient,
    public commonService: CommonService
  ) {
    this.localStorage = JSON.parse(localStorage.getItem('currentUser'));

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: [ 'class' ]
    });
    router.events.forEach((event) => {
      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
      if (event instanceof NavigationStart) {
        this.dialog.closeAll();
      }
    });
    //this.getAllmenus();
  }
  getAllmenus() {
    this.commonService.getAllMenuByRoles(this.localStorage.RoleID).subscribe((data) => {
      if (data['status']) {
        this.dynamicNavItems = data['result'];
        this.dynamicNavItems.sort(function(a, b) {
          if (a.children) {
            a.children.sort(function(c, d) {
              return c.sequence - d.sequence;
            });
          }
          return a.sequence - b.sequence;
        });
        localStorage.setItem('VisibleMenus', JSON.stringify(this.dynamicNavItems));
      }
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
