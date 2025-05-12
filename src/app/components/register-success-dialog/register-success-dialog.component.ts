// register-success-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-success-dialog',
  template: `
    <div class="dialog-container">
      <mat-icon class="success-icon">check_circle</mat-icon>
      <h2 class="dialog-title">Welcome!</h2>
      <p class="dialog-content">Hello {{ data.username }}, your account has been successfully created.</p>
      <div class="dialog-actions">
        <button mat-raised-button
                color="primary"
                (click)="dialogRef.close()"
                class="action-button">
          Continue to Login
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* 使用与登录成功相同的样式 */
    .dialog-container {
      padding: 24px;
      text-align: center;
    }
    .success-icon {
      color: #4CAF50;
      font-size: 60px;
      width: 60px;
      height: 60px;
    }
    .dialog-title {
      color: #3f51b5;
      margin: 16px 0;
    }
    .dialog-content {
      font-size: 16px;
      color: #666;
      margin-bottom: 24px;
    }
    .dialog-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
    .action-button {
      min-width: 160px;
    }
  `]
})
export class RegisterSuccessDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RegisterSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { username: string }
  ) {}
}
