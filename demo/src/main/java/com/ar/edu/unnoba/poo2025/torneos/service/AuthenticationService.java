package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Participante; // OJO: Es 'Participante' en tu modelo

public interface AuthenticationService {
    public String authenticate(Participante participant) throws Exception; 
}