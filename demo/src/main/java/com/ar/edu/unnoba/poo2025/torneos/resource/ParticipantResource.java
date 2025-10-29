package com.ar.edu.unnoba.poo2025.torneos.resource;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.ar.edu.unnoba.poo2025.torneos.dto.CreateParticipantRequestDTO;
import com.ar.edu.unnoba.poo2025.torneos.models.Participante;
import com.ar.edu.unnoba.poo2025.torneos.service.ParticipantService;

@RestController
@RequestMapping("/participant")
public class ParticipantResource {

    private final ParticipantService participantService;
    // Usamos mapeo manual para evitar añadir dependencias adicionales (ModelMapper)

    public ParticipantResource(ParticipantService participantService) {
        this.participantService = participantService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateParticipantRequestDTO dto) {
        try {
            Participante p = new Participante();
            p.setEmail(dto.getEmail());
            p.setPassword(dto.getPassword());
            participantService.create(p);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}
