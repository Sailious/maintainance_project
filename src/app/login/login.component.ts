import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private loginService: LoginService, private router: Router) { }

  onLogin() {
    if (this.email && this.password) {
      this.loginService.login(this.email, this.password).subscribe(
        (response: any) => {
          console.log('Login successful:', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', this.email);
          alert(`Login successfully, welcome to the app, ${this.email}`);
          this.router.navigate(['/users']); // 登录成功后跳转到用户管理页面
        },
        (error: any) => {
          console.error('Login failed:', error);
          if (error.status === 401) {
            alert('Invalid email or password');
          } else if (error.status === 500) {
            alert('Server error');
          } else {
            alert('Login failed');
          }
        }
      );
    } else {
      alert('Please enter both email and password');
    }
  }

  // 添加导航到注册页面的方法
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
