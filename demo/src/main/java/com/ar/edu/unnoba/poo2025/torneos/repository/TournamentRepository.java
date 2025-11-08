package com.ar.edu.unnoba.poo2025.torneos.repository;

import java.util.List;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ar.edu.unnoba.poo2025.torneos.models.Torneo;

@Repository
public interface TournamentRepository extends JpaRepository<Torneo, Integer> {
    List<Torneo> findByPublicadoTrue();
}
