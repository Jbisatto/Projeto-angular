package com.bisatto.meu_backend.auth;

import com.bisatto.meu_backend.service.UsuarioService;
import com.bisatto.meu_backend.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class AuthBasseController {

    @Autowired
    private JwtUtil jwtUtils;

    @Autowired
    private HttpServletRequest servletRequest;

    @Autowired
    protected UsuarioService securityUserService;

    protected JwtUtil getJwtUtils() {
        return jwtUtils;
    }

    protected HttpServletRequest getServletRequest() {
        return servletRequest;
    }

    protected UsuarioService getUsuarioRepository() {
        return securityUserService;
    }

    protected String getUsernameFromRequest() throws Exception {
        String token = getValidJwt();
        if (token == null) {
            throw new Exception();
        }
        Claims body = jwtUtils.getBodyFromToken(token);
        if (body == null) {
            throw new Exception();
        }
        return body.getSubject();
    }

    protected String getValidJwt() throws Exception {
        String token = getJwtFromRequest();
        boolean valid = token != null && jwtUtils.validateToken(token);
        if (!valid) {
            throw new Exception("Token inválido");
        }
        return token;
    }

    /**
     * @return o JWT contido na http request atual
     */
    protected String getJwtFromRequest() {
        return jwtUtils.getJwtFromRequest(servletRequest);
    }

}