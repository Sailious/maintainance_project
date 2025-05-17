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
  failedAttempts = 0;  // 新增：记录失败次数
  lockoutEndTime: Date | null = null;  // 新增：锁定结束时间

  constructor(
    private loginService: LoginService,
    private router: Router,
    private dialog: MatDialog
  ) {
    const storedLockout = localStorage.getItem('loginLockout');
    if (storedLockout) {
      this.lockoutEndTime = new Date(storedLockout);
    }
  }

  onLogin() {
    // 新增：检查是否处于锁定状态
    if (this.lockoutEndTime && new Date() < this.lockoutEndTime) {
      const remaining = Math.ceil((this.lockoutEndTime.getTime() - new Date().getTime()) / 1000 / 60);
      this.dialog.open(LoginErrorDialogComponent, {
        width: '400px',
        data: { message: `Too many login failures, please try again in ${remaining} minutes` },
        disableClose: true
      });
      return;
    }

    if (this.email && this.password) {
      this.loginService.login(this.email, this.password).subscribe({
        next: (response) => {
          // 成功登录时重置状态
          this.failedAttempts = 0;
          this.lockoutEndTime = null;
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
          // 失败时增加计数并检查锁定条件
          this.failedAttempts++;
          if (this.failedAttempts >= 3) {
            this.lockoutEndTime = new Date(Date.now() + 5 * 60 * 1000);  // 5分钟后解锁
            localStorage.setItem('loginLockout', this.lockoutEndTime.toISOString());
          }

          let errorMessage = 'Login failed, please try again later';

          // 根据错误类型细化提示
          if (error.status === 401) {
            errorMessage = 'Incorrect email or password';
          } else if (error.status === 500) {
            errorMessage = 'Internal server error, please contact the administrator';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          // 锁定时更新提示信息
          if (this.failedAttempts >= 3) {
            errorMessage = `If you fail to log in for ${this.failedAttempts} times in a row, your account will be locked for 5 minutes`;
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
        data: { message: 'Please enter your email and password' },
        disableClose: true
      });
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
