package com.bisatto.meu_backend.repository;

import com.bisatto.meu_backend.model.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {
}
