package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Competencia;
import java.util.List;

public interface CompetitionService {
    void create(Integer tournamentId, Competencia competencia) throws Exception;
    List<Competencia> getAllByTournament(Integer tournamentId);
    Competencia getById(Integer id);
    void delete(Integer id) throws Exception;
    // Falta update para completar, lo podes agregar si queres
}