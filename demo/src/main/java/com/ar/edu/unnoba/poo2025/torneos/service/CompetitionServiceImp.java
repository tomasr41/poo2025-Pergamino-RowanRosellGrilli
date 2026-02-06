package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Competencia;
import com.ar.edu.unnoba.poo2025.torneos.models.Torneo;
import com.ar.edu.unnoba.poo2025.torneos.repository.CompetitionRepository;
import com.ar.edu.unnoba.poo2025.torneos.repository.InscriptionRepository;
import com.ar.edu.unnoba.poo2025.torneos.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CompetitionServiceImp implements CompetitionService {

    @Autowired private CompetitionRepository competitionRepository;
    @Autowired private TournamentRepository tournamentRepository;
    @Autowired private InscriptionRepository inscriptionRepository;


    @Override
    public void create(Integer tournamentId, Competencia competencia) throws Exception {
        Torneo torneo = tournamentRepository.findById(tournamentId)
            .orElseThrow(() -> new Exception("Torneo no encontrado"));
        
        competencia.setTorneo(torneo);
        competitionRepository.save(competencia);
    }

    @Override
    public List<Competencia> getAllByTournament(Integer tournamentId) {
        return competitionRepository.findByTorneo_IdTorneo(tournamentId);
    }

    @Override
    public Competencia getById(Integer id) {
        return competitionRepository.findById(id).orElse(null);
    }

    @Override
    public void delete(Integer id) throws Exception {
        if (!competitionRepository.existsById(id)) {
            throw new Exception("Competencia no encontrada");
        }

        if (inscriptionRepository.existsByCompetencia_IdCompetencia(id.longValue())) {
            throw new Exception("No se puede eliminar la competencia: tiene inscriptos.");
        }
        
        competitionRepository.deleteById(id);
    }
}
