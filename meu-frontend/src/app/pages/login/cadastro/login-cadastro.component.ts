import { Component, OnInit } from "@angular/core";
import { sharedImports } from "../../../../shared/shared";
import { AuthService } from "../../../../auth/auth.service";
import { Router } from "@angular/router";
import { NotificacaoService } from "../../../shared/services/notificacao.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-login-cadastro',
    standalone: true,
    imports: [...sharedImports],
    templateUrl: './login-cadastro.component.html',
    styleUrl : './login-cadastro.component.scss'
  })
  export class LoginCadastroComponent implements OnInit {
    errorMessage: string = '';
    successMessage: string = '';
    form!: FormGroup;
  
    constructor(
      private authService: AuthService,
      private router: Router,
      private notificacao: NotificacaoService,
      
    private fb: FormBuilder
    ) {}
    ngOnInit(): void {
        this.form = this.fb.group({
            nome: ['', Validators.required],
            senha: [null, [Validators.required]],
            confirmPassword: [null, [Validators.required]],
          });
    }
  
    onRegister() {
        if (!this.form.valid) {
            return;
        }
        const { nome, senha, confirmPassword } = this.form.value;
      if (senha !== confirmPassword) {
        this.notificacao.mostrar('As senhas não coincidem');
        return;
      }
  
      const user = {
        nome: nome,
        senha: senha
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
  