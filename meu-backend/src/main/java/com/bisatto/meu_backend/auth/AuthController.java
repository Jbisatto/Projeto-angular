package com.bisatto.meu_backend.auth;

import com.bisatto.meu_backend.model.Usuario;
import com.bisatto.meu_backend.model.UsuarioDetails;
import com.bisatto.meu_backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController extends AuthBasseController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    AuthenticationManager authenticationManager;

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrarUsuario(@RequestBody UsuarioRequest usuarioRequest) {
        Usuario usuario = new Usuario();
        usuario.setNome(usuarioRequest.getNome());

        BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();
        usuario.setSenha(bcrypt.encode(usuarioRequest.getSenha()));

        usuarioRepository.save(usuario);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> logar(@RequestBody @Valid AuthRequest loginRequest) {
        String username = loginRequest.getNome();
        String password = loginRequest.getSenha();
        Authentication authentication = new UsernamePasswordAuthenticationToken(username, password);
        try {
            authentication = authenticationManager.authenticate(authentication);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e);
        }
        UsuarioDetails userDetails = (UsuarioDetails) authentication.getPrincipal();

        String token = getJwtUtils().generateLoginToken(userDetails);
        String refreshToken = getJwtUtils().generateRefreshToken(userDetails);

        AuthResponse loginResponse = new AuthResponse(token, refreshToken);
        return ResponseEntity.ok().body(loginResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody @Valid String refreshToken) {
        if (refreshToken != null && getJwtUtils().validateToken(refreshToken)) {
            String username = getJwtUtils().getUserNameFromToken(refreshToken);
            UsuarioDetails aliasUserDetails = (UsuarioDetails) securityUserService.loadUserByUsername(username);
            if (aliasUserDetails != null) {
                String token = getJwtUtils().generateLoginToken(aliasUserDetails);
                String newRefreshToken = getJwtUtils().generateRefreshToken(aliasUserDetails);

                AuthResponse loginResponse = new AuthResponse(token, newRefreshToken);
                return ResponseEntity.ok().body(loginResponse);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autorizado");
    }

}


