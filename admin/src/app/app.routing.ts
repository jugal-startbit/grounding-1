import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuard} from './containers/_guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboardEvent',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'loginEvent',
        loadChildren: './views/loginEvents/loginEvents.module#LoginEventsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'logoutEvent',
        loadChildren: './views/logoutEvents/logoutEvents.module#LogoutEventsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'aboutusEvent',
        loadChildren: './views/aboutusEvents/aboutusEvents.module#AboutusEventsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'contactusEvent',
        loadChildren: './views/contactusEvents/contactusEvents.module#ContactusEventsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'aboutgroundinglogEvent',
        loadChildren: './views/aboutgroundinglogEvents/aboutgroundinglogEvents.module#AboutgroundinglogEventsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'pdfEvent',
        loadChildren: './views/pdfEvents/pdfEvents.module#PdfEventsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'review',
        loadChildren: './views/review/review.module#ReviewModule',
        canActivate: [AuthGuard]
      },
      // {
      //   path: 'login',
      //   component: LoginComponent,
      //   data: {
      //   title: 'Login Page'
      // },
      {
        path: 'deos',
        loadChildren: './views/deo/deo.module#DeoModule',
        canActivate: [AuthGuard],
      },
      {
        path: 'managers',
        loadChildren: './views/manager/manager.module#ManagerModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'employees',
        loadChildren: './views/employee/employee.module#EmployeeModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'payments',
        loadChildren: './views/payment/payment.module#PaymentModule',
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '**',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
