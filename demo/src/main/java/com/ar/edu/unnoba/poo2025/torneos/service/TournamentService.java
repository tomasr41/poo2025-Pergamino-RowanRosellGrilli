package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Administrador;
import com.ar.edu.unnoba.poo2025.torneos.models.Torneo;
import java.util.List;

public interface TournamentService {
    
    // Método existente para participantes
    List<Torneo> getPublishedTournaments();

    // --- MÉTODOS PARA ADMIN (CRUD) ---

    // Crear torneo (Admin)
    void create(Torneo torneo, Administrador creador);
    
    // Crear torneo (Genérico/Test)
    Torneo create(Torneo torneo) throws Exception;

    // Listar todos los torneos (incluye no publicados)
    List<Torneo> getAll(); 

    // Obtener un torneo por ID
    Torneo getById(Integer id);

    // Actualizar un torneo
    void update(Integer id, Torneo torneoActualizado) throws Exception;

    // Eliminar un torneo
    void delete(Integer id) throws Exception;

    // Publicar un torneo (cambiar estado a publicado)
    void publish(Integer id) throws Exception;
}
