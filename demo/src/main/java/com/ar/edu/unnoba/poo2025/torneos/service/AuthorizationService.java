package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Participante; 
import com.ar.edu.unnoba.poo2025.torneos.models.Administrador; 

public interface AuthorizationService {
    public Participante authorize(String token) throws Exception;
    public Administrador authorizeAdmin(String token) throws Exception;
}