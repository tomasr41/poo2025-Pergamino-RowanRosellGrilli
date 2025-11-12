package com.ar.edu.unnoba.poo2025.torneos.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Component
public class JwtTokenUtil {

    // Inyectamos la clave secreta desde application.properties
    @Value("${jwt.secret}")
    private String secret;

    private static final String ISSUER = "torneos-app";

    /**
     * Genera un token JWT para un subject (email).
     * Expira en 10 días y usa HMAC512.
     */
    public String generateToken(String subject) {
        // El vencimiento es de 10 días (en milisegundos)
        long expirationTime = TimeUnit.DAYS.toMillis(10);
        Date expirationDate = new Date(System.currentTimeMillis() + expirationTime);

        Algorithm algorithm = Algorithm.HMAC512(secret);

        String token = JWT.create()
                .withIssuer(ISSUER)
                .withSubject(subject)
                .withIssuedAt(new Date())
                .withExpiresAt(expirationDate)
                .sign(algorithm);

        // Retornamos el token con el prefijo "Bearer "
        return "Bearer " + token;
    }

    /**
     * Verifica si un token es válido.
     */
    public boolean verify(String token) {
        try {
            // El método getDecodedToken ya hace la verificación
            getDecodedToken(token);
            return true;
        } catch (JWTVerificationException e) {
            // Si la verificación falla (firma inválida, expirado, etc.)
            return false;
        }
    }

    /**
     * Obtiene el Subject (email) desde el payload del token.
     */
    public String getSubject(String token) throws JWTVerificationException {
        // Este método lanzará una excepción si el token es inválido
        DecodedJWT decodedJWT = getDecodedToken(token);
        return decodedJWT.getSubject();
    }

    /**
     * Método privado para decodificar y verificar el token.
     * Reutiliza la lógica para verify() y getSubject().
     */
    private DecodedJWT getDecodedToken(String token) throws JWTVerificationException {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new JWTVerificationException("Token ausente o inválido");
        }
        // Quitamos el "Bearer "
        String tokenLimpio = token.substring(7);

        Algorithm algorithm = Algorithm.HMAC512(secret);
        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer(ISSUER)
                .build();

        // Esto verifica la firma, expiración y issuer.
        // Si algo falla, lanza JWTVerificationException.
        return verifier.verify(tokenLimpio);
    }
}