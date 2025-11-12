package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Participante; // OJO: 'Participante'
import com.ar.edu.unnoba.poo2025.torneos.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationServiceImp implements AuthorizationService {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ParticipantService participantService;

    @Override
    public Participante authorize(String token) throws Exception {
        
        // 1. Verificar si el token es válido (firma, expiración)
        // Usamos el método verify() de nuestro Util.
        if (!jwtTokenUtil.verify(token)) {
            throw new Exception("Autorización fallida: Token inválido o expirado.");
        }

        // 2. Recuperar el subject (email) del token
        String email = jwtTokenUtil.getSubject(token);

        // 3. Buscar al participante usando el email del token
        Participante user = participantService.findByEmail(email);

        if (user == null) {
            // Esto no debería pasar si el token fue emitido por nosotros,
            // pero es una buena validación.
            throw new Exception("Autorización fallida: Usuario del token no encontrado.");
        }

        // 4. Retornar el usuario autorizado
        return user;
    }
}