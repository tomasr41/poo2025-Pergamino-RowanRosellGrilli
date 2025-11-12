package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Participante; 
import com.ar.edu.unnoba.poo2025.torneos.util.JwtTokenUtil;
import com.ar.edu.unnoba.poo2025.torneos.util.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationServiceImp implements AuthenticationService {

    @Autowired
    private ParticipantService participantService; // Usamos el servicio de Participante

    @Autowired
    private PasswordEncoder passwordEncoder; // El encoder que creamos antes

    @Autowired
    private JwtTokenUtil jwtTokenUtil; // El util de JWT que acabamos de crear

    @Override
    public String authenticate(Participante participante) throws Exception {
        
        // 1. Buscar al usuario por email
        Participante user = participantService.findByEmail(participante.getEmail());

        if (user == null) {
            throw new Exception("Autenticación fallida: Email no encontrado.");
        }

        // 2. Verificar la contraseña
        boolean passwordMatch = passwordEncoder.verify(participante.getPassword(), user.getPassword());

        if (!passwordMatch) {
            throw new Exception("Autenticación fallida: Contraseña incorrecta.");
        }

        // 3. Generar y retornar el token JWT
        return jwtTokenUtil.generateToken(user.getEmail());
    }
}