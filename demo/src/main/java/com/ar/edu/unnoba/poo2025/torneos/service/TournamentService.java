package com.ar.edu.unnoba.poo2025.torneos.service;

import java.util.List;
import com.ar.edu.unnoba.poo2025.torneos.models.Torneo;

public interface TournamentService {
    List<Torneo> getPublishedTournaments();

    // Nuevo: crear torneo
    Torneo create(Torneo torneo) throws Exception;
}
