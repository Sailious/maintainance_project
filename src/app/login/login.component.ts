// login.component.ts
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { LoginSuccessDialogComponent } from '../components/login-success-dialog/login-success-dialog.component';
import { LoginErrorDialogComponent } from '../components/login-error-dialog/login-error-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  onLogin() {
    if (this.email && this.password) {
      this.loginService.login(this.email, this.password).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', this.email);

          // 打开自定义对话框
          const dialogRef = this.dialog.open(LoginSuccessDialogComponent, {
            width: '400px',
            data: { email: this.email },
            disableClose: true
          });

          // 对话框关闭后跳转
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/users']);
          });
        },
        error: (error) => {
          let errorMessage = 'Login failed, please try again later';

          // 根据错误类型细化提示
          if (error.status === 401) {
            errorMessage = 'Incorrect email or password';
          } else if (error.status === 500) {
            errorMessage = 'Internal server error, please contact the administrator';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          this.dialog.open(LoginErrorDialogComponent, {
            width: '400px',
            data: { message: errorMessage },
            disableClose: true
          });
        }
      });
    } else {
      this.dialog.open(LoginErrorDialogComponent, {
        width: '400px',
        data: { message: '请输入邮箱和密码' },
        disableClose: true
      });
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
