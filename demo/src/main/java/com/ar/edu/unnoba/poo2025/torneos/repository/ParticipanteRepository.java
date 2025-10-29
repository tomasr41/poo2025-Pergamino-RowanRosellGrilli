package com.ar.edu.unnoba.poo2025.torneos.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ar.edu.unnoba.poo2025.torneos.models.Participante;

@Repository
public interface ParticipanteRepository extends JpaRepository<Participante, Long> {
    
    @Query("SELECT p FROM Participante p WHERE p.email = :email")
    public Participante findByEmail(@Param("email") String email);
}
