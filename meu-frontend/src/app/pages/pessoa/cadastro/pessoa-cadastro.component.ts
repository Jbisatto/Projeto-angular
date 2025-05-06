import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PessoaService } from '../pessoa.service';
import { sharedImports } from '../../../../shared/shared';
import { Router } from '@angular/router';
import { NotificacaoService } from '../../../shared/services/notificacao.service';

@Component({
  selector: 'app-pessoa-cadastro',
  standalone: true,
  imports: [...sharedImports],
  templateUrl: './pessoa-cadastro.component.html',
  styleUrl : './pessoa-cadastro.component.scss'
})
export class PessoaCadastroComponent implements OnInit{
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private router: Router,
    private notificacao: NotificacaoService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      idade: [null, [Validators.required, Validators.min(0)]]
    });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.pessoaService.salvar(this.form.value).subscribe({
      next: res => {
        this.notificacao.mostrar('Pessoa salva com sucesso!');
        this.router.navigate(['/pessoa-consulta']);
      },
      error: err => {
        this.notificacao.mostrar('Erro ao salvar a pessoa', 'Fechar', 5000);
      }
    });
  }
}