package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Inscripcion;
import com.ar.edu.unnoba.poo2025.torneos.models.Participante;
import java.util.List;

public interface InscriptionService {
    Inscripcion inscribir(Participante participante, Integer competitionId) throws Exception;
    List<Inscripcion> getInscripcionesPorParticipante(Participante participante);
}
