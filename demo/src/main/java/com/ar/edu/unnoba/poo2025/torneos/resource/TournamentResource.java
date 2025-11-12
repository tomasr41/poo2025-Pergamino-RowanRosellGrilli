package com.ar.edu.unnoba.poo2025.torneos.resource;

import com.ar.edu.unnoba.poo2025.torneos.dto.TournamentResponseDTO;
import com.ar.edu.unnoba.poo2025.torneos.models.Torneo;
import com.ar.edu.unnoba.poo2025.torneos.service.AuthorizationService;
import com.ar.edu.unnoba.poo2025.torneos.service.TournamentService;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken; // Importante para mapear listas
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.Type; // Importante para mapear listas
import java.util.List;

@RestController
@RequestMapping("/tournaments")
public class TournamentResource {

    @Autowired
    private AuthorizationService authorizationService;

    @Autowired
    private TournamentService tournamentService;

    @Autowired
    private ModelMapper modelMapper;

    /**
     * Endpoint para obtener torneos publicados.
     * Requiere un token JWT válido en la cabecera "Authorization".
     */
    @GetMapping
    public ResponseEntity<?> getTournaments(@RequestHeader("Authorization") String token) {
        
        try {
            // 1. Delegar la validación del token al AuthorizationService
            // (Si el token es inválido, esto lanzará una excepción)
            authorizationService.authorize(token);

            // 2. Si el token es válido, obtener los torneos
            List<Torneo> torneos = tournamentService.getPublishedTournaments();

            // 3. Mapear la lista de Entidades a una lista de DTOs
            // Necesitamos definir el 'tipo' de la lista destino para ModelMapper
            Type listType = new TypeToken<List<TournamentResponseDTO>>() {}.getType();
            List<TournamentResponseDTO> dtos = modelMapper.map(torneos, listType);

            // 4. Retornar los DTOs con estado 200 OK
            return ResponseEntity.ok(dtos);

        } catch (Exception e) {
            // 5. Si la autorización falla, retornar 403 Forbidden
            // (Imprimimos el error para debugging)
            System.err.println("Error de autorización: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
