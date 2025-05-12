// services/post-management.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostManagementService {
  private apiBaseUrl = 'http://frp-aim.com:56647/api/admin';

  constructor(private http: HttpClient) { }

  // 获取帖子列表
  getPosts(page: number = 1): Observable<any> {
    return page === 1
      ? this.http.get(`${this.apiBaseUrl}/posts`)
      : this.http.get(`${this.apiBaseUrl}/posts/${page}`);
  }

  // 删除帖子
  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/posts/${postId}`);
  }

  // 获取评论
  getComments(postId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/comments/${postId}`);
  }

  // 删除评论
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/comments/${commentId}`);
  }
}
