package com.ar.edu.unnoba.poo2025.torneos.repository;

import com.ar.edu.unnoba.poo2025.torneos.models.Competencia;
import com.ar.edu.unnoba.poo2025.torneos.models.Inscripcion;
import com.ar.edu.unnoba.poo2025.torneos.models.Participante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscripcion, Long> {

  
    List<Inscripcion> findByParticipante(Participante participante);

 
    List<Inscripcion> findByCompetencia(Competencia competencia);

    /**
     * Cuenta cuántas inscripciones existen para una competencia.
     * Fundamental para validar el CUPO antes de inscribir a alguien más.
     * SELECT COUNT(*) FROM inscripcion WHERE id_competencia = ?
     */
    int countByCompetencia(Competencia competencia);

    /**
     * Busca una inscripción específica de un participante en una competencia.
     * Se usa para validar si el participante YA ESTÁ inscripto y evitar duplicados.
     * Devuelve un Optional para manejar  si existe o no.
     */
    Optional<Inscripcion> findByParticipanteAndCompetencia(Participante participante, Competencia competencia);

}