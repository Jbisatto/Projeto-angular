import { Component } from "@angular/core";
import { sharedImports } from "../../../../shared/shared";
import { AuthService } from "../../../../auth/auth.service";
import { Router } from "@angular/router";
import { NotificacaoService } from "../../../shared/services/notificacao.service";

@Component({
    selector: 'app-login-cadastro',
    standalone: true,
    imports: [...sharedImports],
    templateUrl: './login-cadastro.component.html',
    styleUrl : './login-cadastro.component.scss'
  })
  export class LoginCadastroComponent {
    nome: string = '';
    senha: string = '';
    confirmPassword: string = '';
    errorMessage: string = '';
    successMessage: string = '';
  
    constructor(
      private authService: AuthService,
      private router: Router,
      private notificacao: NotificacaoService
    ) {}
  
    onRegister() {
      if (this.senha !== this.confirmPassword) {
        this.notificacao.mostrar('As senhas não coincidem');
        return;
      }
  
      const user = {
        nome: this.nome,
        senha: this.senha
      };
  
      this.authService.register(user).subscribe({
        next: () => {
            this.notificacao.mostrar('Cadastro realizado com sucesso!');
            this.router.navigate(['/login']);
        },
        error: (err) => {
            this.notificacao.mostrar('Erro ao cadastrar. Tente outro nome de usuário.');
        }
      });
    }
  }
  