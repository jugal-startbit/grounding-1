import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyComponent } from './company/company.component';
import { CompanyFormComponent} from './company/company-form.component';

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

import { MainTaskComponent} from './mainTask/mainTask.component';
import { MainTaskFormComponent} from './mainTask/mainTask-form.component';

import { PermissionComponent} from './permission/permission.component';

import { HolidayComponent} from './holiday/holiday.component';
import { HolidayFormComponent} from './holiday/holiday-form.component';
import {NotificationComponent} from './notification/notification.component';
import { LeaderComponent} from './leader/leader.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Settings'
    },
    children: [
      {
        path: '',
        redirectTo: 'company'
      },
      {
        path: 'company',
        component: CompanyComponent,
        data: {
          title: 'Company'
        }
      },
      {
        path: 'companyForm/:id',
        component: CompanyFormComponent,
        data: {
          title: 'CompanyForm'
        }
      },
      {
        path: 'branch',
        component: BranchComponent,
        data: {
          title: 'Branch'
        }
      },
      {
        path: 'branchForm/:id',
        component: BranchFormComponent,
        data: {
          title: 'BranchForm'
        }
      },
      {
        path: 'department',
        component: DepartmentComponent,
        data: {
          title: 'Department'
        }
      },
      {
        path: 'departmentForm/:id',
        component: DepartmentFormComponent,
        data: {
          title: 'DepartmentForm'
        }
      },
      {
        path: 'role',
        component: RoleComponent,
        data: {
          title: 'Role'
        }
      },
      {
        path: 'roleForm/:id',
        component: RoleFormComponent,
        data: {
          title: 'RoleForm'
        }
      },
      {
        path: 'client',
        component: ClientComponent,
        data: {
          title: 'Client'
        }
      },
      {
        path: 'clientForm/:id',
        component: ClientFormComponent,
        data: {
          title: 'ClientForm'
        }
      },
      {
        path: 'user',
        component: UserComponent,
        data: {
          title: 'User'
        }
      },
      {
        path: 'userForm/:id',
        component: UserFormComponent,
        data: {
          title: 'UserForm'
        }
      },
      {
        path: 'Task',
        component: MainTaskComponent,
        data: {
          title: 'MainTask'
        }
      },
      {
        path: 'TaskForm/:id',
        component: MainTaskFormComponent,
        data: {
          title: 'MainTaskForm'
        }
      },
      {
        path: 'permission',
        component: PermissionComponent,
        data: {
          title: 'Permission'
        }
      },
      {
        path: 'holiday',
        component: HolidayComponent,
        data: {
          title: 'HoliDay'
        }
      },
      {
        path: 'holidayForm/:id',
        component: HolidayFormComponent,
        data: {
          title: 'HolidayForm'
        }
      },
      {
        path: 'leader',
        component: LeaderComponent,
        data: {
          title: 'Leader'
        }
      },
      {
        path: 'notification',
        component: NotificationComponent,
        data: {
          title: 'Notification'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
