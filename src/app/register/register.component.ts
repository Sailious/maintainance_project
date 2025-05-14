// register.component.ts
import { Component } from '@angular/core';
import { RegisterService } from '../services/register.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RegisterSuccessDialogComponent } from '../components/register-success-dialog/register-success-dialog.component';
import { RegisterErrorDialogComponent } from '../components/register-error-dialog/register-error-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  private previousUrl: string;
  confirmPassword: any;


  constructor(
    private registerService: RegisterService,
    private router: Router,
    private dialog: MatDialog,
    private location: Location
  ) { const navigation = this.router.getCurrentNavigation();
    this.previousUrl = navigation?.extras?.state?.['from'] || '/users';}

  onRegister() {
    if (this.username && this.email && this.password) {
      this.registerService.register(this.username, this.email, this.password).subscribe({
        next: () => {
          const dialogRef = this.dialog.open(RegisterSuccessDialogComponent, {
            width: '400px',
            data: { username: this.username },
            disableClose: true
          });

          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          let errorMessage = 'Registration failed, please try again later';

          // 细化错误提示
          if (error.status === 400) {
            errorMessage = error.error?.error === 'Username Exists'
                ? 'Username already exists'
                : error.error?.error === 'Email Exists'
                    ? 'Email already exists'
                    : 'Other error occurred';
          }else if (error.status === 500) {
            errorMessage = 'Internal server error, please contact the administrator';
          }

          this.dialog.open(RegisterErrorDialogComponent, {
            width: '400px',
            data: { message: errorMessage },
            disableClose: true
          });
        }
      });
    } else {
      this.dialog.open(RegisterErrorDialogComponent, {
        width: '400px',
        data: { message: 'Please fill in all required fields' },
        disableClose: true
      });
    }
  }

  goBack() {
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl);
    } else {
      this.location.back();
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}


