package com.ar.edu.unnoba.poo2025.torneos.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
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
}
