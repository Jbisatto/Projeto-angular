package com.bisatto.meu_backend.utils;

import com.bisatto.meu_backend.model.UsuarioDetails;
import com.bisatto.meu_backend.service.UsuarioService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class JwtUtil {

    private static final String issuer = "JeffersonBisatto";
    private static final String secret = "FeQfrEjhH292K1KBUCdfqQSx8aMFdsawKEL7h8mdthBNFQVE2Hpda3g2RthpWk8kLfBP7cHX5Gfmcdx7DJXN2quS";
    private static final long expirationMs = TimeUnit.MINUTES.toMillis(30);
    private static final long refreshExpirationMs = TimeUnit.HOURS.toMillis(1);

    @Autowired
    private UsuarioService securityUserService;

    public String generateLoginToken(UsuarioDetails usuarioDetails) {
        long currentTimeMillis = System.currentTimeMillis();
        return Jwts.builder()
                .setIssuer(issuer)
                .setSubject(usuarioDetails.getUsername())
                .claim("nome", usuarioDetails.getNome())
                .setIssuedAt(new Date(currentTimeMillis))
                .setExpiration(new Date(currentTimeMillis + expirationMs))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public String generateRefreshToken(UsuarioDetails securityUser) {
        long currentTimeMillis = System.currentTimeMillis();
        return Jwts.builder()
                .setIssuer(issuer)
                .setSubject(securityUser.getUsername())
                .setIssuedAt(new Date(currentTimeMillis))
                .setExpiration(new Date(currentTimeMillis + refreshExpirationMs))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public String generateTempToken(String subject, Long expirationMs) {
        long currentTimeMillis = System.currentTimeMillis();
        return Jwts.builder()
                .setIssuer(issuer)
                .setSubject(subject)
                .setIssuedAt(new Date(currentTimeMillis))
                .setExpiration(new Date(currentTimeMillis + expirationMs))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public String generateTempToken(String subject, Long expirationMs, Map<String, Object> claims) {
        long currentTimeMillis = System.currentTimeMillis();
        return Jwts.builder()
                .setIssuer(issuer)
                .setSubject(subject)
                .addClaims(claims)
                .setIssuedAt(new Date(currentTimeMillis))
                .setExpiration(new Date(currentTimeMillis + expirationMs))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(authToken);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUserNameFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Claims getBodyFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }

    public String getJwtFromRequest(HttpServletRequest request) {
        String requestTokenHeader = request.getHeader("Authorization");
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            return requestTokenHeader.substring(7);
        }
        return null;
    }

    public Authentication getAuthentication(String token) {
        Claims claims = getBodyFromToken(token);  // Extrai as claims do JWT
        String username = claims.getSubject();  // Aqui, normalmente, você pega o 'sub', que seria o nome de usuário

        // Carregando o UserDetails
        UserDetails userDetails = securityUserService.loadUserByUsername(username);

        // Retorna uma instância de Authentication, que será armazenada no SecurityContextHolder
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

}

