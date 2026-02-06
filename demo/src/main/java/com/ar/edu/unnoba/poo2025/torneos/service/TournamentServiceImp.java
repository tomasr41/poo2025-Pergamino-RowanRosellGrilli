package com.ar.edu.unnoba.poo2025.torneos.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import com.ar.edu.unnoba.poo2025.torneos.repository.TournamentRepository;
import com.ar.edu.unnoba.poo2025.torneos.models.Torneo;
import com.ar.edu.unnoba.poo2025.torneos.models.Administrador;
import com.ar.edu.unnoba.poo2025.torneos.repository.CompetitionRepository;


@Service
public class TournamentServiceImp implements TournamentService {

    private final TournamentRepository tournamentRepository;
    private final CompetitionRepository competitionRepository;

    @Autowired
    public TournamentServiceImp(TournamentRepository tournamentRepository,
                                CompetitionRepository competitionRepository) {
        this.tournamentRepository = tournamentRepository;
        this.competitionRepository = competitionRepository;
    }

   

    // --- MÉTODOS PÚBLICOS (PARTICIPANTES) ---

    @Override
    public List<Torneo> getPublishedTournaments() {
        // Retorna solo los torneos que tienen el flag 'publicado' en true 
        return tournamentRepository.findByPublicadoTrue();
    }

    // --- MÉTODOS DE ADMINISTRACIÓN (CRUD) ---

    @Override
    @Transactional
    public Torneo create(Torneo torneo) throws Exception {
        // 1. Validar que las fechas no sean nulas y que el orden sea cronológico 
        validateDates(torneo);
        
        // 2. Por defecto, un torneo recién creado es un borrador (no publicado) 
        torneo.setPublicado(false);
        
        // 3. Guardar en la base de datos y retornar la entidad persistida (con su ID) 
        return tournamentRepository.save(torneo);
    }

    @Override
    @Transactional
    public void create(Torneo torneo, Administrador creador) {
        try {
            // Asignar el administrador responsable del torneo 
            torneo.setAdministrador(creador);
            // Reutilizar la lógica de creación y validación principal 
            this.create(torneo);
        } catch (Exception e) {
            // Convertir la excepción comprobada a Runtime para manejarla en el flujo de Spring 
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public List<Torneo> getAll() {
        // Retorna todos los torneos (publicados o no) ordenados por fecha de inicio descendente 
        return tournamentRepository.findAllByOrderByFechaInicioDesc();
    }

    @Override
    public Torneo getById(Integer id) {
        // Busca un torneo por su ID 
        return tournamentRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public void update(Integer id, Torneo torneoActualizado) throws Exception {
        // 1. Verificar existencia del torneo original 
        Torneo torneo = tournamentRepository.findById(id)
                .orElseThrow(() -> new Exception("Torneo no encontrado con ID: " + id));
        
        // 2. Validar los nuevos datos de fecha 
        validateDates(torneoActualizado);

        // 3. Actualizar campos permitidos (Nombre, Descripción y Fechas) 
        torneo.setNombre(torneoActualizado.getNombre());
        torneo.setDescripcion(torneoActualizado.getDescripcion());
        torneo.setFechaInicio(torneoActualizado.getFechaInicio());
        torneo.setFechaFin(torneoActualizado.getFechaFin());

        // 4. Persistir los cambios 
        tournamentRepository.save(torneo);
    }

    @Override
    @Transactional
    public void delete(Integer id) throws Exception {
        if (!tournamentRepository.existsById(id)) {
            throw new Exception("Torneo no encontrado");
        }
        if (competitionRepository.existsByTorneo_IdTorneo(id)) {
            throw new Exception("No se puede eliminar el torneo: tiene competencias creadas.");
        }
        tournamentRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void publish(Integer id) throws Exception {
        Torneo torneo = tournamentRepository.findById(id)
                .orElseThrow(() -> new Exception("Torneo no encontrado"));
        
        // Cambia el estado el estado de publicación (toggle) 
        torneo.setPublicado(!torneo.isPublicado());
        tournamentRepository.save(torneo);
    }

    /**
     * Centraliza la lógica de validación de fechas para evitar inconsistencias.
     */
    private void validateDates(Torneo torneo) throws Exception {
        if (torneo.getFechaInicio() == null || torneo.getFechaFin() == null) {
            throw new Exception("Las fechas de inicio y fin son obligatorias.");
        }
        if (torneo.getFechaInicio().isBefore(java.time.LocalDate.now())) {
            throw new Exception("La fecha de inicio no puede ser anterior a hoy.");
        }
        if (torneo.getFechaInicio().isAfter(torneo.getFechaFin())) {
            throw new Exception("La fecha de inicio no puede ser posterior a la fecha de fin.");
        }
    }
}