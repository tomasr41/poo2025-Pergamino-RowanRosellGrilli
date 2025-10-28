package com.ar.edu.unnoba.poo2025.torneos.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ar.edu.unnoba.poo2025.torneos.models.Participante;

public interface ParticipanteRepository extends JpaRepository<Participante, Long> {
    
    @Query("SELECT p FROM Participante p WHERE p.email = :email")
    public Participante findByEmail(@Param("email") String email);
}
