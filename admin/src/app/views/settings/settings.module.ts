import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModuleModule} from '../../containers/material-module/material-module.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { SettingsRoutingModule} from './settings-routing.module';
import { DialogComponent} from './client/client-form.component';
import { ShowDialogComponent} from './client/client.component';
import {HttpClientModule} from '@angular/common/http';
import { ShowDepartmentBranchComponent} from './branch/branch.component';
import { TreeviewModule } from 'ngx-treeview';

import { CompanyComponent} from './company/company.component';
import { CompanyFormComponent } from './company/company-form.component';

import { BranchComponent} from './branch/branch.component';
import { BranchFormComponent} from './branch/branch-form.component';

import { DepartmentComponent} from './department/department.component';
import { DepartmentFormComponent} from './department/department-form.component';

import { RoleComponent} from './role/role.component';
import { RoleFormComponent} from './role/role-form.component';

import { ClientComponent} from './client/client.component';
import { ClientFormComponent} from './client/client-form.component';

import { UserComponent} from './user/user.component';
import { UserFormComponent} from './user/user-form.component';

import {MainTaskComponent, ViewDialogComponent} from './mainTask/mainTask.component';
import { MainTaskFormComponent} from './mainTask/mainTask-form.component';

import { PermissionComponent} from './permission/permission.component';

import { HolidayComponent} from './holiday/holiday.component';
import { HolidayFormComponent} from './holiday/holiday-form.component';

import { LeaderComponent} from './leader/leader.component';
import {ModalModule} from 'ngx-bootstrap';
import {CreateDepartmentComponent} from './user/user-form.component';
import {NotificationComponent} from './notification/notification.component';

@NgModule({
  declarations: [
    CompanyComponent,
    CompanyFormComponent,
    BranchComponent,
    BranchFormComponent,
    DepartmentComponent,
    DepartmentFormComponent,
    RoleComponent,
    RoleFormComponent,
    ClientComponent,
    ClientFormComponent,
    UserComponent,
    UserFormComponent,
    MainTaskComponent,
    MainTaskFormComponent,
    DialogComponent,
    ShowDialogComponent,
    ShowDepartmentBranchComponent,
    ViewDialogComponent,
    PermissionComponent,
    HolidayComponent,
    HolidayFormComponent,
    LeaderComponent,
    CreateDepartmentComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MaterialModuleModule,
    HttpClientModule,
    Ng4LoadingSpinnerModule.forRoot(),
    TreeviewModule.forRoot(),
    ModalModule.forRoot()
  ],
  exports: [],
  entryComponents: [
    DialogComponent,
    ShowDialogComponent,
    ShowDepartmentBranchComponent,
    ViewDialogComponent,
    CreateDepartmentComponent
  ]
})
export class SettingsModule { }
