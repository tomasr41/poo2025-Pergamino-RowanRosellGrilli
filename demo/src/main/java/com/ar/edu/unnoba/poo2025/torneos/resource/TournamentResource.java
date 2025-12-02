package com.ar.edu.unnoba.poo2025.torneos.resource;

import com.ar.edu.unnoba.poo2025.torneos.dto.CompetitionResponseDTO;
import com.ar.edu.unnoba.poo2025.torneos.dto.InscriptionResponseDTO;
import com.ar.edu.unnoba.poo2025.torneos.dto.TournamentResponseDTO;
import com.ar.edu.unnoba.poo2025.torneos.models.Competencia;
import com.ar.edu.unnoba.poo2025.torneos.models.Inscripcion;
import com.ar.edu.unnoba.poo2025.torneos.models.Participante;
import com.ar.edu.unnoba.poo2025.torneos.models.Torneo;
import com.ar.edu.unnoba.poo2025.torneos.service.AuthorizationService;
import com.ar.edu.unnoba.poo2025.torneos.service.CompetitionService;
import com.ar.edu.unnoba.poo2025.torneos.service.InscriptionService;
import com.ar.edu.unnoba.poo2025.torneos.service.TournamentService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

@RestController
// NO usamos @RequestMapping a nivel de clase para poder cumplir estrictamente
// con las rutas del PDF (/tournaments, /inscriptions, etc.) sin prefijos.
public class TournamentResource {

    @Autowired private AuthorizationService authorizationService;
    @Autowired private TournamentService tournamentService;
    @Autowired private CompetitionService competitionService;
    @Autowired private InscriptionService inscriptionService;
    @Autowired private ModelMapper modelMapper;

    // ==========================================
    // 1. TORNEOS (PÚBLICO / PARTICIPANTE)
    // ==========================================

    // Listar torneos publicados y vigentes
    // GET /tournaments
    @GetMapping("/tournaments")
    public ResponseEntity<?> getTournaments(@RequestHeader("Authorization") String token) {
        try {
            authorizationService.authorize(token); // Valida token de participante
            List<Torneo> torneos = tournamentService.getPublishedTournaments();
            
            Type listType = new TypeToken<List<TournamentResponseDTO>>() {}.getType();
            List<TournamentResponseDTO> dtos = modelMapper.map(torneos, listType);
            
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // Ver detalle de un torneo específico
    // GET /tournament/{id}
    @GetMapping("/tournament/{id}")
    public ResponseEntity<?> getTournamentDetail(@RequestHeader("Authorization") String token,
                                                 @PathVariable Integer id) {
        try {
            authorizationService.authorize(token);
            Torneo torneo = tournamentService.getById(id);
            
            if (torneo == null || !torneo.isPublicado()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Torneo no encontrado o no disponible.");
            }
            
            TournamentResponseDTO dto = modelMapper.map(torneo, TournamentResponseDTO.class);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // ==========================================
    // 2. COMPETENCIAS
    // ==========================================

    // Ver competencias de un torneo
    // GET /tournament/{id}/competitions
    @GetMapping("/tournament/{id}/competitions")
    public ResponseEntity<?> getCompetitions(@RequestHeader("Authorization") String token,
                                             @PathVariable Integer id) {
        try {
            authorizationService.authorize(token);
            List<Competencia> comps = competitionService.getAllByTournament(id);
            
            Type listType = new TypeToken<List<CompetitionResponseDTO>>() {}.getType();
            List<CompetitionResponseDTO> dtos = modelMapper.map(comps, listType);
            
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Ver detalle de una competencia específica
    // GET /tournament/{tournamentId}/competitions/{id}
    @GetMapping("/tournament/{tournamentId}/competitions/{id}")
    public ResponseEntity<?> getCompetitionDetail(@RequestHeader("Authorization") String token,
                                                  @PathVariable Integer tournamentId,
                                                  @PathVariable Integer id) {
        try {
            authorizationService.authorize(token);
            Competencia comp = competitionService.getById(id);
            
            if (comp == null || !comp.getTorneo().getIdTorneo().equals(tournamentId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Competencia no encontrada en este torneo.");
            }
            
            CompetitionResponseDTO dto = modelMapper.map(comp, CompetitionResponseDTO.class);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==========================================
    // 3. INSCRIPCIONES
    // ==========================================

    // Inscribirse a una competencia
    // POST /tournament/{id}/competitions/{compId}/inscription
    @PostMapping("/tournament/{id}/competitions/{compId}/inscription")
    public ResponseEntity<?> inscribirse(@RequestHeader("Authorization") String token,
                                         @PathVariable Integer id, // ID torneo (URL)
                                         @PathVariable Integer compId) { // ID competencia
        try {
            Participante p = authorizationService.authorize(token);
            
            // La lógica de negocio (validar cupo, fecha, descuento) está en el servicio
            Inscripcion inscripcion = inscriptionService.inscribir(p, compId);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                        "mensaje", "Inscripción exitosa", 
                        "precioPagado", inscripcion.getPrecioPagado()
                    ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Ver mis inscripciones (Historial)
    // GET /inscriptions
    @GetMapping("/inscriptions")
    public ResponseEntity<?> getMyInscriptions(@RequestHeader("Authorization") String token) {
        try {
            Participante p = authorizationService.authorize(token);
            List<Inscripcion> lista = inscriptionService.getInscripcionesPorParticipante(p);
            
            // Mapeo manual para asegurar que los nombres anidados se muestren bien
            List<InscriptionResponseDTO> dtos = lista.stream().map(i -> {
                InscriptionResponseDTO dto = new InscriptionResponseDTO();
                dto.setIdInscripcion(i.getIdInscripcion());
                dto.setFechaInscripcion(i.getFechaInscripcion());
                dto.setPrecioPagado(i.getPrecioPagado());
                dto.setNombreCompetencia(i.getCompetencia().getNombre());
                dto.setNombreTorneo(i.getCompetencia().getTorneo().getNombre());
                return dto;
            }).toList();
            
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
