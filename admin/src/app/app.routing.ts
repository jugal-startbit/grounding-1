import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
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
        path: 'user',
        loadChildren: './views/user/user.module#UserModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'aboutusEvent',
        loadChildren: './views/aboutusEvents/aboutusEvents.module#AboutusEventsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'review',
        loadChildren: './views/review/review.module#ReviewModule',
        canActivate: [AuthGuard]
      },
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
