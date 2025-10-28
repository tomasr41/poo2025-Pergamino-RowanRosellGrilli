package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Participante;

public interface ParticipantService {

    /**
     * Crea un nuevo participante en el sistema.
     * @param participante El participante a crear (con datos sin procesar).
     * @throws Exception Si el email ya está en uso.
     */
    public void create(Participante participante) throws Exception;

}
