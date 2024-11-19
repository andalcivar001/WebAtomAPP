import { Routes } from '@angular/router';

export const routes: Routes = [
  //   {
  //     path: '',
  //     redirectTo: '/auth',
  //     pathMatch: 'full',
  //   },

  //   {
  //     path: 'home',
  //     loadComponent: () =>
  //       import('./modules/example-page/example-page.component').then(
  //         (m) => m.ExamplePageComponent
  //       ),
  //   },
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
];
