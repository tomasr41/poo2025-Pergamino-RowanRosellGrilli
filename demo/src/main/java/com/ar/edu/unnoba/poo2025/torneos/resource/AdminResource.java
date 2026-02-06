package com.ar.edu.unnoba.poo2025.torneos.resource;

import com.ar.edu.unnoba.poo2025.torneos.dto.*;
import com.ar.edu.unnoba.poo2025.torneos.models.Administrador;
import com.ar.edu.unnoba.poo2025.torneos.models.Competencia;
import com.ar.edu.unnoba.poo2025.torneos.models.Torneo;
import com.ar.edu.unnoba.poo2025.torneos.service.*;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/admin")
public class AdminResource {

    @Autowired private AdminService adminService;
    @Autowired private AuthenticationService authenticationService;
    @Autowired private AuthorizationService authorizationService;
    @Autowired private TournamentService tournamentService;
    @Autowired private CompetitionService competitionService;
    @Autowired private ModelMapper modelMapper;

    // ==========================================
    // 1. GESTIÓN DE CUENTAS (ADMINS)
    // ==========================================

    @PostMapping("/auth")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequestDTO request) {
        try {
            Administrador admin = modelMapper.map(request, Administrador.class);
            String token = authenticationService.authenticateAdmin(admin);
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/accounts")
    public ResponseEntity<?> getAllAccounts(@RequestHeader("Authorization") String token) {
        try {
            authorizationService.authorizeAdmin(token);
            List<Administrador> admins = adminService.getAll();
            Type listType = new TypeToken<List<AdminResponseDTO>>() {}.getType();
            List<AdminResponseDTO> dtos = modelMapper.map(admins, listType);
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PostMapping("/accounts")
    public ResponseEntity<?> createAccount(@RequestHeader("Authorization") String token, 
                                           @RequestBody CreateAdminRequestDTO request) {
        try {
            authorizationService.authorizeAdmin(token);
            Administrador newAdmin = modelMapper.map(request, Administrador.class);
            adminService.create(newAdmin);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/accounts/{id}")
    public ResponseEntity<?> deleteAccount(@RequestHeader("Authorization") String token, 
                                           @PathVariable Long id) {
        try {
            Administrador currentAdmin = authorizationService.authorizeAdmin(token);
            adminService.delete(id, currentAdmin.getEmail());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ==========================================
    // 2. GESTIÓN DE TORNEOS (CRUD COMPLETO)
    // ==========================================

    @GetMapping("/tournaments")
    public ResponseEntity<?> getAllTournaments(@RequestHeader("Authorization") String token) {
        try {
            authorizationService.authorizeAdmin(token);
            List<Torneo> torneos = tournamentService.getAll();
            
            // CORRECCIÓN: Mapeo manual para asegurar que se use el constructor de 6 parámetros y @JsonFormat
            List<TournamentResponseDTO> dtos = torneos.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @GetMapping("/tournaments/{id}")
    public ResponseEntity<?> getTournament(@RequestHeader("Authorization") String token, 
                                           @PathVariable Integer id) {
        try {
            authorizationService.authorizeAdmin(token);
            Torneo torneo = tournamentService.getById(id);
            
            if (torneo == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Torneo no encontrado");
            }

            // CORRECCIÓN: Usar el método auxiliar para el DTO con fechas
            return ResponseEntity.ok(convertToResponseDTO(torneo));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PostMapping("/tournaments")
    public ResponseEntity<?> createTournament(@RequestHeader("Authorization") String token,
                                              @Valid @RequestBody CreateTournamentRequestDTO dto) { 
        try {
            Administrador admin = authorizationService.authorizeAdmin(token);

            Torneo torneo = new Torneo();
            torneo.setNombre(dto.getNombre());
            torneo.setDescripcion(dto.getDescripcion());
            torneo.setFechaInicio(dto.getFechaInicio());
            torneo.setFechaFin(dto.getFechaFin());
            torneo.setPublicado(false);
            torneo.setAdministrador(admin);

            Torneo saved = tournamentService.create(torneo); 

            // Devolvemos el DTO completo
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToResponseDTO(saved));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/tournaments/{id}")
    public ResponseEntity<?> updateTournament(@RequestHeader("Authorization") String token, 
                                              @PathVariable Integer id,
                                              @RequestBody CreateTournamentRequestDTO dto) {
        try {
            authorizationService.authorizeAdmin(token);
            
            Torneo datosNuevos = new Torneo();
            datosNuevos.setNombre(dto.getNombre());
            datosNuevos.setDescripcion(dto.getDescripcion());
            datosNuevos.setFechaInicio(dto.getFechaInicio());
            datosNuevos.setFechaFin(dto.getFechaFin());
            
            tournamentService.update(id, datosNuevos);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/tournaments/{id}")
    public ResponseEntity<?> deleteTournament(@RequestHeader("Authorization") String token, 
                                              @PathVariable Integer id) {
        try {
            authorizationService.authorizeAdmin(token);
            tournamentService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @PatchMapping("/tournaments/{id}/published")
    public ResponseEntity<?> publishTournament(@RequestHeader("Authorization") String token, 
                                               @PathVariable Integer id) {
        try {
            authorizationService.authorizeAdmin(token);
            tournamentService.publish(id); 
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ==========================================
    // 3. GESTIÓN DE COMPETENCIAS (ADMIN)
    // ==========================================

    @PostMapping("/tournaments/{id}/competitions")
    public ResponseEntity<?> createCompetition(@RequestHeader("Authorization") String token,
                                               @PathVariable Integer id,
                                               @RequestBody CreateCompetitionRequestDTO dto) {
        try {
            authorizationService.authorizeAdmin(token);
            
            Competencia comp = new Competencia();
            comp.setNombre(dto.getName());
            comp.setCupo(dto.getCupo());
            comp.setPrecioBase(dto.getPrecio());
            
            competitionService.create(id, comp);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/tournaments/{id}/competitions")
    public ResponseEntity<?> getCompetitionsAdmin(@RequestHeader("Authorization") String token,
                                                  @PathVariable Integer id) {
        try {
            authorizationService.authorizeAdmin(token);
            List<Competencia> comps = competitionService.getAllByTournament(id);
            Type listType = new TypeToken<List<CompetitionResponseDTO>>() {}.getType();
            List<CompetitionResponseDTO> dtos = modelMapper.map(comps, listType);
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @DeleteMapping("/competitions/{id}")
    public ResponseEntity<?> deleteCompetition(@RequestHeader("Authorization") String token,
                                            @PathVariable Integer id) {
        try {
            authorizationService.authorizeAdmin(token);
            competitionService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    /**
     * MÉTODO AUXILIAR: Convierte una Entidad Torneo al DTO de respuesta
     * Asegura que el constructor de 6 parámetros se llame correctamente.
     */
    private TournamentResponseDTO convertToResponseDTO(Torneo t) {
        return new TournamentResponseDTO(
                t.getIdTorneo() == null ? null : t.getIdTorneo().longValue(),
                t.getNombre(),
                t.getDescripcion(),
                t.getFechaInicio(),
                t.getFechaFin(),
                t.isPublicado()
        );
    }
}