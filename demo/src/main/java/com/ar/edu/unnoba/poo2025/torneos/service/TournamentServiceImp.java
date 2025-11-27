package com.ar.edu.unnoba.poo2025.torneos.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import com.ar.edu.unnoba.poo2025.torneos.repository.TournamentRepository;
import com.ar.edu.unnoba.poo2025.torneos.models.Torneo;

@Service
public class TournamentServiceImp implements TournamentService {

    private final TournamentRepository tournamentRepository;

    @Autowired
    public TournamentServiceImp(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }

    @Override
    public List<Torneo> getPublishedTournaments() {
        return tournamentRepository.findByPublicadoTrue();
    }

    @Override
    @Transactional
    public Torneo create(Torneo torneo) throws Exception {
        // Validaciones básicas de fechas
        if (torneo.getFechaInicio() == null || torneo.getFechaFin() == null) {
            throw new Exception("Fecha de inicio y fin son obligatorias.");
        }
        if (torneo.getFechaInicio().isAfter(torneo.getFechaFin())) {
            throw new Exception("La fecha de inicio no puede ser posterior a la fecha de fin.");
        }
        // Por defecto no publicado
        torneo.setPublicado(false);
        return tournamentRepository.save(torneo);
    }
}
