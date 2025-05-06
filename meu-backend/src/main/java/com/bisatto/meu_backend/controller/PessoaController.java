package com.bisatto.meu_backend.controller;

import com.bisatto.meu_backend.model.Pessoa;
import com.bisatto.meu_backend.repository.PessoaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pessoas")
public class PessoaController {

    private final PessoaRepository repository;

    public PessoaController(PessoaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Pessoa> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Pessoa criar(@RequestBody Pessoa pessoa) {
        return repository.save(pessoa);
    }

    @PutMapping("/{id}")
    public Pessoa editar(@PathVariable Long id, @RequestBody Pessoa pessoa) {
        pessoa.setId(id);
        return repository.save(pessoa);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
