import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { AuthRequest } from '../../../auth/auth.models';
import { sharedImports } from '../../../shared/shared';
import { NotificacaoService } from '../../shared/services/notificacao.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...sharedImports,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule],
  templateUrl: './login.component.html',
  styleUrl : './login.component.scss'
})
export class LoginComponent {
  nome: string = '';
  senha: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificacao: NotificacaoService
  ) {}

  onLogin() {
    const authRequest: AuthRequest = {
      nome: this.nome,
      senha: this.senha
    };

    this.authService.login(authRequest).subscribe({
      next: (response) => {
        // Salva tokens
        localStorage.setItem('access_token', response.accessToken);
        localStorage.setItem('refresh_token', response.refreshToken);

        // Redireciona após login
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.notificacao.mostrar('Usuário ou senha inválidos');
      }
    });
  }
  
}
