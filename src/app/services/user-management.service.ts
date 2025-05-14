import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private http: HttpClient) { }

  private apiBaseUrl = 'http://frp-fit.com:56647/api/admin'; // 后端 API 的基础 URL

  // 分页获取用户列表
  getUsers(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/users/${page}`);
  }

  // 添加用户
  addUser(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/user`, { username, email, password });
  }

  // 通过用户ID获取用户信息
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/user/${id}`);
  }

  // 修改用户信息
  updateUser(id: number, username: string, email: string, password: string): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/user/${id}`, { username, email, password });
  }

  // 删除用户
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/user/${id}`);
  }

  // 用户搜索
  searchUsers(keyword: string, page: number = 1): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/user/search/${page}`, { keyword });
  }
}
