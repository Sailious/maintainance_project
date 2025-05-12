import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { RegisterComponent } from './register/register.component';
import { PostManagementComponent } from "./post-management/post-management.component";


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: UserManagementComponent },
  { path: 'posts', component: PostManagementComponent },
  {
    path: 'users',
    component: UserManagementComponent,
    data: { title: 'User Management' }
  },
  {
    path: 'posts',
    component: PostManagementComponent,
    data: { title: 'Posts Management' }
  },
  { path: '', redirectTo: '/users', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
