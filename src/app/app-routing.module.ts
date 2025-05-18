import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { RegisterComponent } from './register/register.component';
import { PostManagementComponent } from "./post-management/post-management.component";
import { SongManagementComponent } from "./song-management/song-management.component";
import { AuthGuard } from "./ auth.guard";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/register',
    component: RegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UserManagementComponent,
    canActivate: [AuthGuard],
    data: { title: 'User Management' }
  },
  {
    path: 'posts',
    component: PostManagementComponent,
    canActivate: [AuthGuard],
    data: { title: 'Posts Management' }
  },
  {
    path: 'songs',
    component: SongManagementComponent,
    canActivate: [AuthGuard],
    data: { title: 'Songs Management' }
  },
  { path: '', redirectTo: '/users', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
