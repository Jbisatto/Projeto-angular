package com.bisatto.meu_backend.service;

import com.bisatto.meu_backend.model.Usuario;
import com.bisatto.meu_backend.model.UsuarioDetails;
import com.bisatto.meu_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = loadUserEntityByUsername(username);
        UsuarioDetails userDetails = new UsuarioDetails();
        userDetails.setUsername(usuario.getNome());
        userDetails.setPassword(usuario.getSenha());
        return userDetails;
    }

    public Usuario loadUserEntityByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository
                .findByNome(username)
                .orElseThrow(() -> new UsernameNotFoundException("Acesso não encontrado para o usuário: " + username));
    }

}