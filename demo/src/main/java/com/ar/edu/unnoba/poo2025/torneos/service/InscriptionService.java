package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Inscripcion;
import com.ar.edu.unnoba.poo2025.torneos.models.Participante;
import java.util.List;
import java.util.Map;

public interface InscriptionService {
    Inscripcion inscribir(Participante participante, Integer competitionId) throws Exception;
    List<Inscripcion> getInscripcionesPorParticipante(Participante participante);
    boolean isInscribed(Participante participante, Integer competenciaId);
    Map<String, Object> preview(Participante participante, Integer competitionId) throws Exception;
}
