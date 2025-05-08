import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  constructor(private router: Router) {}

  logout() {
    // 这里可以添加退出登录的逻辑
    this.router.navigate(['/login']);
  }
}