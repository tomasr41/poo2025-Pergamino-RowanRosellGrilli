package com.ar.edu.unnoba.poo2025.torneos.resource;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

import com.ar.edu.unnoba.poo2025.torneos.dto.TournamentResponseDTO;
import com.ar.edu.unnoba.poo2025.torneos.models.Torneo;
import com.ar.edu.unnoba.poo2025.torneos.service.TournamentService;
import com.ar.edu.unnoba.poo2025.torneos.service.AuthorizationService;

@RestController
@RequestMapping("/tournaments")
public class TournamentResource {

    private final TournamentService tournamentService;
    private final AuthorizationService authorizationService;

    public TournamentResource(TournamentService tournamentService, AuthorizationService authorizationService) {
        this.tournamentService = tournamentService;
        this.authorizationService = authorizationService;
    }

    @GetMapping
    public ResponseEntity<?> getTournaments(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (!authorizationService.validateToken(authHeader)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            List<Torneo> published = tournamentService.getPublishedTournaments();
            List<TournamentResponseDTO> dtos = published.stream()
                .map(t -> {
                    Long id = (t.getIdTorneo() == null) ? null : t.getIdTorneo().longValue();
                    return new TournamentResponseDTO(id, t.getNombre(), t.getDescripcion());
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
