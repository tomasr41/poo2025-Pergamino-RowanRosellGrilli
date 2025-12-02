package com.ar.edu.unnoba.poo2025.torneos.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import com.ar.edu.unnoba.poo2025.torneos.repository.TournamentRepository;
import com.ar.edu.unnoba.poo2025.torneos.models.Torneo;
import com.ar.edu.unnoba.poo2025.torneos.models.Administrador;

@Service
public class TournamentServiceImp implements TournamentService {

    private final TournamentRepository tournamentRepository;

    @Autowired
    public TournamentServiceImp(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }

    // --- MÉTODOS PÚBLICOS (PARTICIPANTES) ---

    @Override
    public List<Torneo> getPublishedTournaments() {
        return tournamentRepository.findByPublicadoTrue();
    }

    // --- MÉTODOS DE ADMINISTRACIÓN (CRUD) ---

    @Override
    @Transactional
    public Torneo create(Torneo torneo) throws Exception {
        // Validaciones básicas de fechas
        if (torneo.getFechaInicio() == null || torneo.getFechaFin() == null) {
            throw new Exception("Fecha de inicio y fin son obligatorias.");
        }
        if (torneo.getFechaInicio().isAfter(torneo.getFechaFin())) {
            throw new Exception("La fecha de inicio no puede ser posterior a la fecha de fin.");
        }
        // Por defecto no publicado
        torneo.setPublicado(false);
        return tournamentRepository.save(torneo);
    }

    // Sobrecarga para usar cuando pasamos el creador explícitamente (si hiciera falta)
    @Override
    @Transactional
    public void create(Torneo torneo, Administrador creador) {
        try {
            // Reutilizamos la lógica de validación
            if (torneo.getFechaInicio() == null || torneo.getFechaFin() == null) {
                throw new RuntimeException("Fecha de inicio y fin son obligatorias.");
            }
            if (torneo.getFechaInicio().isAfter(torneo.getFechaFin())) {
                throw new RuntimeException("La fecha de inicio no puede ser posterior a la fecha de fin.");
            }
            
            torneo.setPublicado(false);
            torneo.setAdministrador(creador);
            tournamentRepository.save(torneo);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public List<Torneo> getAll() {
        // Retorna todos los torneos ordenados por fecha de inicio descendente
        // Asegúrate de tener este método en tu repositorio o usar findAll() con Sort
        return tournamentRepository.findAllByOrderByFechaInicioDesc();
    }

    @Override
    public Torneo getById(Integer id) {
        return tournamentRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public void update(Integer id, Torneo torneoActualizado) throws Exception {
        Torneo torneo = tournamentRepository.findById(id)
                .orElseThrow(() -> new Exception("Torneo no encontrado con ID: " + id));
        
        // Actualizamos solo los campos permitidos
        torneo.setNombre(torneoActualizado.getNombre());
        torneo.setDescripcion(torneoActualizado.getDescripcion());
        
        // Validar fechas nuevamente si cambian
        if (torneoActualizado.getFechaInicio() != null && torneoActualizado.getFechaFin() != null) {
             if (torneoActualizado.getFechaInicio().isAfter(torneoActualizado.getFechaFin())) {
                throw new Exception("La fecha de inicio no puede ser posterior a la fecha de fin.");
            }
            torneo.setFechaInicio(torneoActualizado.getFechaInicio());
            torneo.setFechaFin(torneoActualizado.getFechaFin());
        }

        tournamentRepository.save(torneo);
    }

    @Override
    @Transactional
    public void delete(Integer id) throws Exception {
        if (!tournamentRepository.existsById(id)) {
            throw new Exception("Torneo no encontrado con ID: " + id);
        }
        tournamentRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void publish(Integer id) throws Exception {
        Torneo torneo = tournamentRepository.findById(id)
                .orElseThrow(() -> new Exception("Torneo no encontrado con ID: " + id));
        
        torneo.setPublicado(true);
        tournamentRepository.save(torneo);
    }
}