import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { RegisterComponent } from './components/register/register.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: SidebarComponent,
    children: [
      {
        path: 'main',
        component: MainComponent,
        ...canActivate(redirectUnauthorizedToLogin)
      },
      {
        path: 'admin-main',
        component: RegisterComponent,
        ...canActivate(redirectUnauthorizedToLogin)
      }
    ],
    ...canActivate(redirectUnauthorizedToLogin)
  },

  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
