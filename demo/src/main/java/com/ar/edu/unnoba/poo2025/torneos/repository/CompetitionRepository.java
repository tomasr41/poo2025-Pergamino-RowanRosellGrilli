package com.ar.edu.unnoba.poo2025.torneos.repository;

import com.ar.edu.unnoba.poo2025.torneos.models.Competencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompetitionRepository extends JpaRepository<Competencia, Integer> {
    List<Competencia> findByTorneo_IdTorneo(Integer idTorneo);
    boolean existsByTorneo_IdTorneo(Integer idTorneo);

}