import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

  private apiBaseUrl = 'http://frp-fit.com:56647/api/admin';// 后端 API 的基础 URL

  // 用户登录
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/login`, {email, password});
  }

  // 退出登录
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }
}
