package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Participante; 

public interface AuthorizationService {
    public Participante authorize(String token) throws Exception;
}