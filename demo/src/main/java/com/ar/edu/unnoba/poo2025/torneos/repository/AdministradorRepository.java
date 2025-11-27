package com.ar.edu.unnoba.poo2025.torneos.repository;

import com.ar.edu.unnoba.poo2025.torneos.models.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    
    Optional<Administrador> findByEmail(String email);
    
}