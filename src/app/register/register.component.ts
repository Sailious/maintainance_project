import { Component } from '@angular/core';
import { RegisterService } from '../services/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(private registerService: RegisterService, private router: Router) { }

  onRegister() {
    if (this.username && this.email && this.password) {
      this.registerService.register(this.username, this.email, this.password).subscribe(
        (response: any) => {
          console.log('Registration successful:', response);
          alert(`Registration successful, welcome to the app, ${this.username}`);
          this.router.navigate(['/login']); // 注册成功后跳转到登录页面
        },
        (error: any) => {
          console.error('Registration failed:', error);
          if (error.status === 400) {
            alert('Username or email already exists');
          } else if (error.status === 500) {
            alert('Server error');
          } else {
            alert('Registration failed');
          }
        }
      );
    } else {
      alert('Please fill in all fields');
    }
  }

  // 添加导航到登录页面的方法
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
