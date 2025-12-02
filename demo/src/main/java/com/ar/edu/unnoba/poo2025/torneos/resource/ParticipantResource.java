package com.ar.edu.unnoba.poo2025.torneos.resource;

import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.ar.edu.unnoba.poo2025.torneos.dto.AuthenticationRequestDTO;
import com.ar.edu.unnoba.poo2025.torneos.dto.CreateParticipantRequestDTO;
import com.ar.edu.unnoba.poo2025.torneos.models.Participante;
import com.ar.edu.unnoba.poo2025.torneos.service.AuthenticationService;
import com.ar.edu.unnoba.poo2025.torneos.service.ParticipantService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/participant") // Ruta base (la que ya tenías)
public class ParticipantResource {

    private final ParticipantService participantService;

    // --- Dependencias añadidas ---
    private final AuthenticationService authenticationService;
    private final ModelMapper modelMapper;

 
    public ParticipantResource(ParticipantService participantService,
                             AuthenticationService authenticationService,
                             ModelMapper modelMapper) {
        this.participantService = participantService;
        this.authenticationService = authenticationService;
        this.modelMapper = modelMapper;
    }

    /**
     * Registro de participante
     */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateParticipantRequestDTO dto) {
        try {
            // Mapeamos el DTO a la entidad Participante usando ModelMapper
            Participante p = modelMapper.map(dto, Participante.class);
            
            // El servicio se encarga de hashear el password y guardar
            participantService.create(p);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    /**
     * Login de participante.
     * Recibe un JSON con email y password, y devuelve un token.
     */
    @PostMapping(value = "/auth", produces = "application/json")
    public ResponseEntity<?> authentication(@RequestBody AuthenticationRequestDTO requestDTO) {

        try {
            // 1. Mapear DTO a la entidad (usando ModelMapper como se pidió)
            // Usamos 'Participante' porque ese es tu nombre de modelo.
            Participante participant = modelMapper.map(requestDTO, Participante.class);

            // 2. Delegar la autenticación al servicio
            String token = authenticationService.authenticate(participant);

            // 3. Si tiene éxito, retornar el token en un JSON
            // (La práctica pide un JSON con "token": "valor")
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("token", token);

            return ResponseEntity.ok(responseBody);

        } catch (Exception e) {
            // 4. Si falla (email no existe, pass incorrecta), retornar 401
            // Devolvemos el mensaje de error (ej: "Contraseña incorrecta")
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}