// register.component.ts
import { Component } from '@angular/core';
import { RegisterService } from '../services/register.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RegisterSuccessDialogComponent } from '../components/register-success-dialog/register-success-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(
    private registerService: RegisterService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  onRegister() {
    if (this.username && this.email && this.password) {
      this.registerService.register(this.username, this.email, this.password).subscribe({
        next: (response) => {
          const dialogRef = this.dialog.open(RegisterSuccessDialogComponent, {
            width: '400px',
            data: { username: this.username },
            disableClose: true
          });

          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {//TODO: 把alert改成弹窗
          // 保持原有错误处理
          console.error('Registration failed:', error);
          if (error.status === 400) {
            alert('Username or email already exists');
          } else if (error.status === 500) {
            alert('Server error');
          } else {
            alert('Registration failed');
          }
        }
      });
    } else {
      alert('Please fill in all fields');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
