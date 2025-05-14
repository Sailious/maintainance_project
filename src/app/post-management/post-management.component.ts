// post-management.component.ts
import {Component, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {NavigationExtras, Router} from '@angular/router';
import {LoginService} from '../services/login.service';
import {PostManagementService} from '../services/post-management.service';

interface PaginationResponse {
  posts: any[];
  total: number;
  totalPages: number;
}

interface Comment {
  id: number;
  content: string;
  username: string;
  created_at: string;
  post_id: number;
}

@Component({
  selector: 'app-post-management',
  templateUrl: './post-management.component.html',
  styleUrls: ['./post-management.component.css']
})
export class PostManagementComponent implements OnInit {
  // Post related properties
  posts: any[] = [];
  selectedPostId: number | null = null;
  comments: Comment[] = [];

  // Pagination properties
  pageSize = 10;
  currentPage = 1;
  total = 0;
  totalPages = 1;

  // Table column definitions
  displayedColumns: string[] = ['id', 'content', 'created_at', 'actions'];
  commentColumns: string[] = ['username', 'content', 'created_at', 'actions'];

  constructor(
    private postService: PostManagementService,
    private router: Router,
    private loginService: LoginService
  ) {
  }

  ngOnInit() {
    this.loadPosts();
  }

  navigateToRegister() {
    const navigationExtras: NavigationExtras = {
      state: {from: this.router.url} // 携带当前URL
    };
    this.router.navigate(['/admin/register'], navigationExtras);
  }

  // Load posts
  loadPosts(): void {
    this.postService.getPosts(this.currentPage).subscribe({
      next: (response: PaginationResponse) => {
        this.posts = response.posts;
        this.total = response.total;
        this.totalPages = response.totalPages;
      },
      error: (error) => this.handleError(error)
    });
  }

  // Handle pagination events
  handlePageEvent(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.loadPosts();
  }

  // View comments for post
  onViewComments(postId: number): void {
    this.selectedPostId = postId;
    this.postService.getComments(postId).subscribe({
      next: (comments) => this.comments = comments,
      error: (error) => this.handleError(error)
    });
  }

  // Delete post
  onDeletePost(postId: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(postId).subscribe({
        next: () => {
          alert('Post deleted successfully');//TODO: 把alert改成弹窗
          this.loadPosts();
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  // Delete comment
  onDeleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.postService.deleteComment(commentId).subscribe({
        next: () => {
          alert('Comment deleted successfully');//TODO: 把alert改成弹窗
          if (this.selectedPostId) {
            this.onViewComments(this.selectedPostId);
          }
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  // Handle logout
  onLogout() {
    // 清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');


    // 跳转至登录页
    this.router.navigate(['/login']);
  }

  // Error handling
  private handleError(error: any): void {
    if (error.status === 401) {
      this.loginService.logout();
      this.router.navigate(['/login']);
    } else {
      alert('Operation failed: ' + (error.error?.message || 'Unknown error'));//TODO: 把alert改成弹窗
    }
  }
}
