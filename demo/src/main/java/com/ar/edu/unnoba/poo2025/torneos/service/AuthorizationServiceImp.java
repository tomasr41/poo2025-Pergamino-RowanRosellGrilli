package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Administrador;
import com.ar.edu.unnoba.poo2025.torneos.models.Participante;
import com.ar.edu.unnoba.poo2025.torneos.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationServiceImp implements AuthorizationService {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ParticipantService participantService;
    
    @Autowired
    private AdminService adminService; // Inyectamos el servicio de admin

    // Implementación para Participantes (ya existía)
    @Override
    public Participante authorize(String token) throws Exception {
        // 1. Verificar validez del token
        if (!jwtTokenUtil.verify(token)) throw new Exception("Token inválido.");
        
        // 2. Verificar rol
        if (!"PARTICIPANTE".equals(jwtTokenUtil.getRole(token))) {
            throw new Exception("Acceso denegado: token no corresponde a participante.");
        }

        // 3. Obtener email
        String email = jwtTokenUtil.getSubject(token);
        
        // 4. Buscar solo en Participantes
        Participante user = participantService.findByEmail(email);
        
        if (user == null) throw new Exception("Usuario no encontrado o no es un participante.");
        
        return user;
    }

    // Implementación para Administradores
    @Override
    public Administrador authorizeAdmin(String token) throws Exception {
        
        // 1. Verificar validez del token (firma y fecha)
        if (!jwtTokenUtil.verify(token)) {
            throw new Exception("Token inválido o expirado.");
        }

        // 2. Verificar rol
        if (!"ADMIN".equals(jwtTokenUtil.getRole(token))) {
            throw new Exception("Acceso denegado: token no corresponde a administrador.");
        }

        // 3. Obtener el email del payload
        String email = jwtTokenUtil.getSubject(token);
        
        // 4. Buscar ESPECÍFICAMENTE en la tabla de administradores
        Administrador admin = adminService.findByEmail(email);
        
        // 4. Si no existe como admin, denegar acceso
        if (admin == null) {
            throw new Exception("Acceso denegado: El usuario no es administrador.");
        }
        
        return admin;
    }
}