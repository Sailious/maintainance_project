import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 从本地存储中获取令牌
    const token = localStorage.getItem('token');

    if (token) {
      // 如果存在令牌，克隆原始请求并添加 Authorization 请求头
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    } else {
      // 如果不存在令牌，直接发送原始请求
      return next.handle(req);
    }
  }
}
