import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { UserManagementService } from '../services/user-management.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  created_at?: string;
}

interface PaginationResponse {
  users: User[];
  total: number;      // 添加total字段
  totalPages: number;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  // 用户列表和分页
  users: User[] = [];
  total = 0;
  currentPage = 1;
  totalPages = 1;

  // 搜索相关
  searchType: 'keyword' | 'id' = 'keyword';
  searchKeyword = '';

  // 表单控制
  showAddForm = false;
  showEditForm = false;
  newUser = { username: '', email: '', password: '' };
  editedUser: any = {
    id: null,
    username: '',
    email: '',
    password: ''
  };

  constructor(
    private userManagementService: UserManagementService,
    private loginService: LoginService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUsers(this.currentPage);
  }


  loadUsers(page: number): void {
    this.userManagementService.getUsers(page).subscribe({
      next: (response: PaginationResponse) => {
        this.users = response.users;
        this.total = response.total;       // 使用正确的total字段
        this.totalPages = response.totalPages;
        this.currentPage = page;
      },
      error: (error) => this.handleAuthError(error)
    });
  }

  // 搜索功能
  onSearch(): void {
    if (this.searchType === 'id') {
      this.handleIdSearch();
    } else {
      this.handleKeywordSearch();
    }
  }

  private handleIdSearch(): void {
    const id = Number(this.searchKeyword);
    if (isNaN(id)) {
      alert('Please enter a valid numeric ID');//TODO: 把alert改成弹窗
      return;
    }

    this.userManagementService.getUserById(id).subscribe({
      next: (response: User[]) => {
        if (response.length > 0) {
          this.users = response;
          this.totalPages = 1;
          this.currentPage = 1;
        } else {
          this.users = [];
          alert('User not found');//TODO: 把alert改成弹窗
        }
      },
      error: (error) => this.handleSearchError(error)
    });
  }

  private handleKeywordSearch(): void {
    this.userManagementService.searchUsers(this.searchKeyword, this.currentPage).subscribe({
      next: (response: PaginationResponse) => {
        this.users = response.users;
        this.totalPages = response.totalPages;
      },
      error: (error) => this.handleSearchError(error)
    });
  }

  // 用户操作
  onEdit(userId: number): void {
    this.userManagementService.getUserById(userId).subscribe({
      next: (response: User[]) => {
        if (response.length > 0) {
          const { id, username, email } = response[0];
          this.editedUser = { id, username, email, password: '' };
          this.showEditForm = true;
          this.cdr.detectChanges();
        } else {
          alert('User not found');//TODO: 把alert改成弹窗
        }
      },
      error: (error) => this.handleSearchError(error)
    });
  }

  onUpdateUser(userId: number): void {
    if (!this.validateUserForm(this.editedUser)) return;

    this.userManagementService.updateUser(
      userId,
      this.editedUser.username,
      this.editedUser.email,
      this.editedUser.password
    ).subscribe({
      next: () => {
        alert('User updated successfully');//TODO: 把alert改成弹窗
        this.closeEditForm();
        this.loadUsers(this.currentPage);
      },
      error: (error) => this.handleUpdateError(error)
    });
  }

  onDelete(userId: number): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userManagementService.deleteUser(userId).subscribe({
      next: () => {
        alert('User deleted successfully');//TODO: 把alert改成弹窗
        this.loadUsers(this.currentPage);
      },
      error: (error) => this.handleDeleteError(error)
    });
  }

  onLogout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  // 表单控制
  closeEditForm(): void {
    this.showEditForm = false;
    this.editedUser = { id: null, username: '', email: '', password: '' };
  }

  // 错误处理
  private handleAuthError(error: any): void {
    console.error('Authentication error:', error);
    if (error.status === 401) {
      this.router.navigate(['/login']);
    } else {
      alert('Failed to load data');//TODO: 把alert改成弹窗
    }
  }

  private handleSearchError(error: any): void {
    console.error('Search error:', error);
    alert(error.status === 404 ? 'User not found' : 'Search failed');//TODO: 把alert改成弹窗
  }

  private handleUpdateError(error: any): void {
    console.error('Update error:', error);
    alert(error.status === 400 ? 'Username/email already exists' : 'Update failed');//TODO: 把alert改成弹窗
  }

  private handleDeleteError(error: any): void {
    console.error('Delete error:', error);
    alert('Delete failed: ' + (error.error?.message || 'Unknown error'));//TODO: 把alert改成弹窗
  }

  // 表单验证
  private validateUserForm(user: User): boolean {
    if (!user.username.trim() || !user.email.trim()) {
      alert('Username and email are required');//TODO: 把alert改成弹窗
      return false;
    }
    return true;
  }

  // 分页控制

  // 修改分页事件处理
  handlePageEvent(event: PageEvent) {
    this.currentPage = event.pageIndex + 1; // 保持与后端一致的页码
    this.loadUsers(this.currentPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadUsers(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadUsers(this.currentPage + 1);
    }
  }
}
