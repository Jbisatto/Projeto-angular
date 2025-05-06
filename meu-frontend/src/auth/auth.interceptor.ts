import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('access_token');
    
    if (accessToken) {
      req = req.clone({
        setHeaders: { 
          Authorization: `Bearer ${accessToken}` 
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Se o token expirar, tente renovar com o refresh token
          return this.authService.refreshToken().pipe(
            switchMap((refreshResponse) => {
              // A resposta do refresh token contém um novo access token
              const newAccessToken = refreshResponse['accessToken'];
              if (newAccessToken) {
                // Atualize o access token no localStorage
                localStorage.setItem('access_token', newAccessToken);
                // Agora, clone a requisição original com o novo access token
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newAccessToken}`
                  }
                });
              }
              // Reenvie a requisição original com o novo access token
              return next.handle(req);
            })
          );
        }
        throw error;
      })
    );
  }
}
