package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Administrador;
import com.ar.edu.unnoba.poo2025.torneos.models.Participante;

public interface AuthenticationService {
    
    // Autenticación para Participantes (Login normal)
    String authenticate(Participante participant) throws Exception;

    // NUEVO: Autenticación para Administradores (Login admin)
    String authenticateAdmin(Administrador admin) throws Exception;
}