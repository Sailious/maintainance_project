import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router) {}

  login() {
    // 这里可以添加登录验证逻辑
    // 简单模拟登录成功
    this.router.navigate(['/users']);
  }
}