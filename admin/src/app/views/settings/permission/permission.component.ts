import {Component, OnInit, ViewChild, Injectable} from '@angular/core';
import { PermissionService} from './permission.service';
import { Router} from '@angular/router';

import { MatDialog, MatDialogRef  } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import { slideToLeft } from '../../../router.animations';
import {TreeviewI18n, TreeviewItem, TreeviewConfig, TreeviewHelper, TreeviewComponent,
  TreeviewEventParser, OrderDownlineTreeviewEventParser, DownlineTreeviewItem} from 'ngx-treeview';
import { RoleService} from '../role/role.service';
import { AuthenticationService} from '../../../containers/_services/authentication.service';


export class ProductTreeviewConfig extends TreeviewConfig {
  hasAllCheckBox = false;
  hasFilter = false;
  hasCollapseExpand = false;
  maxHeight = 400;
}

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
  animations: [slideToLeft()],
  providers: [
    { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser },
    { provide: TreeviewConfig, useClass: ProductTreeviewConfig }],
})
export class PermissionComponent implements OnInit {
  allMenus: any = [];
  showSpinner: boolean;
  @ViewChild(TreeviewComponent) treeviewComponent: TreeviewComponent;
  items: TreeviewItem[];
  rows: string[];
  allRoles: any = [];
  RoleID: string;
  constructor(
    private permissionService: PermissionService,
    private router: Router,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar,
    private roleService: RoleService,
    private authenticationService: AuthenticationService
  ) {
    setTimeout(() => {
      this.authenticationService.checkSelectedComponentVisiblity('Permission');
    }, 100);
    this.showSpinner = false;
  }

  ngOnInit() {
    this.getAllRoles();
  }
  onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
      // console.log(this.items);
  }
  getAllMenus() {
    this.spinnerService.show();
    this.permissionService.getAll(this.RoleID).subscribe((data) => {
      if (data['status']) {
        this.allMenus = data['result'];
        this.allMenus.sort(function(a, b) {
          if (a.children) {
            a.children.sort(function(c, d) {
              return c.sequence - d.sequence;
            });
          }
          return a.sequence - b.sequence;
        });
        const tempArray = [];
        for (const arr of this.allMenus) {
          const val = new TreeviewItem(arr);
          tempArray.push(val);
        }
        this.items = tempArray;
        this.spinnerService.hide();
      }
    });
  }
  getAllRoles() {
    this.spinnerService.show();
    this.roleService.getAllRoles().subscribe((data) => {
      if (data['status'])  {
        this.allRoles = data['result'];
        this.spinnerService.hide();
      }
    });
  }
  onSubmit() {
    this.showSpinner = true;
    this.permissionService.updatePermission(this.RoleID, this.items).subscribe((data) => {
      if (data['status']) {
        this.showSpinner = false;
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
      }
    });
  }
}
