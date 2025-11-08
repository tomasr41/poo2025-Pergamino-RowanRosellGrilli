package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Participante;
import com.ar.edu.unnoba.poo2025.torneos.repository.ParticipanteRepository;
import com.ar.edu.unnoba.poo2025.torneos.util.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ParticipantServiceImp implements ParticipantService {

    // Inyectamos los repositorios y utilidades que necesitamos
    private final ParticipanteRepository participanteRepository;
    private final PasswordEncoder passwordEncoder;

  
    public ParticipantServiceImp(ParticipanteRepository participanteRepository, PasswordEncoder passwordEncoder) {
        this.participanteRepository = participanteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Implementación del método para crear un nuevo participante.
     */
    @Override
    public void create(Participante participant) throws Exception {
        
        // 1. Validar que no existe otro participante con el mismo email
        Participante participanteExistente = participanteRepository.findByEmail(participant.getEmail());
        
        if (participanteExistente != null) {
            // 2. Si existe, lanzar una excepción
            throw new Exception("Ya existe un participante con el email: " + participant.getEmail());
        }

        // 3. Si no existe, hashear la contraseña ANTES de guardarla
     
        String passwordHasheada = passwordEncoder.encode(participant.getPassword());
        participant.setPassword(passwordHasheada);

        // 4. Guardar el nuevo participante en la base de datos
        participanteRepository.save(participant);
    }
}