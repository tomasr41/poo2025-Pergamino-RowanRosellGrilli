package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Administrador;
import com.ar.edu.unnoba.poo2025.torneos.models.Participante;
import com.ar.edu.unnoba.poo2025.torneos.util.JwtTokenUtil;
import com.ar.edu.unnoba.poo2025.torneos.util.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationServiceImp implements AuthenticationService {

    @Autowired
    private ParticipantService participantService;
    
    @Autowired
    private AdminService adminService; // Inyectamos el servicio de admin

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    // Implementación para Participantes (Login normal)
    @Override
    public String authenticate(Participante participant) throws Exception {
        // 1. Buscamos el participante
        Participante user = participantService.findByEmail(participant.getEmail());
        
        if (user == null) {
            throw new Exception("Autenticación fallida: Email no encontrado.");
        }

        // 2. Verificamos la contraseña
        if (!passwordEncoder.verify(participant.getPassword(), user.getPassword())) {
            throw new Exception("Autenticación fallida: Contraseña incorrecta.");
        }

        // 3. Generamos el token
        return jwtTokenUtil.generateToken(user.getEmail());
    }

    // Implementación para Administradores (Login Admin)
    @Override
    public String authenticateAdmin(Administrador admin) throws Exception {
        // 1. Buscamos el admin en la base de datos de administradores
        // Usamos el AdminService que creamos para buscar específicamente administradores
        Administrador user = adminService.findByEmail(admin.getEmail());
        
        if (user == null) {
            throw new Exception("Autenticación fallida: Admin no encontrado.");
        }

        // 2. Verificamos la contraseña
        if (!passwordEncoder.verify(admin.getPassword(), user.getPassword())) {
            throw new Exception("Autenticación fallida: Contraseña incorrecta.");
        }

        // 3. Generamos el token
        // Nota: El token es igual, pero quien lo posea solo podrá pasar 
        // por los filtros de AuthorizationService.authorizeAdmin()
        return jwtTokenUtil.generateToken(user.getEmail());
    }
}