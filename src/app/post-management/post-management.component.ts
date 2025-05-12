// post-management/post-management.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { PostManagementService } from '../services/post-management.service';

@Component({
  selector: 'app-post-management',
  templateUrl: './post-management.component.html',
  styleUrls: ['./post-management.component.css']
})
export class PostManagementComponent implements OnInit {
  posts: any[] = [];
  currentPage = 1;
  totalPages = 1;
  selectedPostId: number | null = null;
  comments: any[] = [];

  constructor(
    private postService: PostManagementService,
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.loadPosts();
  }

  onLogout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  loadPosts(): void {
    this.postService.getPosts(this.currentPage).subscribe({
      next: (response) => {
        this.posts = response.posts;
        this.totalPages = response.totalPages;
      },
      error: (error) => this.handleError(error)
    });
  }

  onDeletePost(postId: number): void {
    if (confirm('确认删除该帖子？')) {
      this.postService.deletePost(postId).subscribe({
        next: () => {
          alert('删除成功');
          this.loadPosts();
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  onViewComments(postId: number): void {
    this.selectedPostId = postId;
    this.postService.getComments(postId).subscribe({
      next: (comments) => this.comments = comments,
      error: (error) => this.handleError(error)
    });
  }

  onDeleteComment(commentId: number): void {
    if (confirm('确认删除该评论？')) {
      this.postService.deleteComment(commentId).subscribe({
        next: () => {
          alert('评论已删除');
          if (this.selectedPostId) this.onViewComments(this.selectedPostId);
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPosts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPosts();
    }
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.loginService.logout();
      this.router.navigate(['/login']);
    } else {
      alert('操作失败: ' + (error.error?.message || '未知错误'));
    }
  }
}
