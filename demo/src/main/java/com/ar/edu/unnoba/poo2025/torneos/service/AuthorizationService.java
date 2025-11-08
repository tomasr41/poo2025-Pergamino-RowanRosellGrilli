package com.ar.edu.unnoba.poo2025.torneos.service;

import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {
    // Para pruebas: acepta un token de ejemplo. Reemplazar por verificación JWT real en producción.
    private static final String TEST_TOKEN = "TEST-TOKEN";

    public boolean validateToken(String token) {
        if (token == null) return false;
        // si viene con "Bearer " lo limpiamos
        if (token.startsWith("Bearer ")) token = token.substring(7);
        return TEST_TOKEN.equals(token);
    }
}
