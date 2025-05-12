// login.component.ts
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { LoginSuccessDialogComponent } from '../components/login-success-dialog/login-success-dialog.component';

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
          // 错误处理保持不变
        }
      });
    } else {
      alert('Please enter both email and password');//TODO: 把alert改成弹窗
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
