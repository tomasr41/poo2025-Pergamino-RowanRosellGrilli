package com.ar.edu.unnoba.poo2025.torneos.repository;

import com.ar.edu.unnoba.poo2025.torneos.models.Torneo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TournamentRepository extends JpaRepository<Torneo, Integer> {

 
    List<Torneo> findByPublicadoTrue();

    
    List<Torneo> findAllByOrderByFechaInicioDesc();
}
