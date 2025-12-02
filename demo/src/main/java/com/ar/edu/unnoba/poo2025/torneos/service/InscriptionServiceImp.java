package com.ar.edu.unnoba.poo2025.torneos.service;

import com.ar.edu.unnoba.poo2025.torneos.models.Competencia;
import com.ar.edu.unnoba.poo2025.torneos.models.Inscripcion;
import com.ar.edu.unnoba.poo2025.torneos.models.Participante;
import com.ar.edu.unnoba.poo2025.torneos.repository.CompetitionRepository;
import com.ar.edu.unnoba.poo2025.torneos.repository.InscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
public class InscriptionServiceImp implements InscriptionService {

    @Autowired private InscriptionRepository inscripcionRepository;
    @Autowired private CompetitionRepository competitionRepository;

    @Override
    @Transactional
    public Inscripcion inscribir(Participante participante, Integer competitionId) throws Exception {
        // 1. Buscar competencia
        Competencia competencia = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new Exception("Competencia no encontrada"));

        // 2. Validar que el torneo no haya empezado
        if (competencia.getTorneo().getFechaInicio().isBefore(LocalDate.now())) {
            throw new Exception("El torneo ya comenzó, no puedes inscribirte.");
        }

        // 3. Validar cupo
        // Nota: Esto es simple. Lo ideal sería un count en el repo para eficiencia.
        int inscriptos = competencia.getInscripciones().size();
        if (inscriptos >= competencia.getCupo()) {
            throw new Exception("No hay cupos disponibles.");
        }

        // 4. Validar si ya está inscripto en ESTA competencia
        boolean yaInscripto = inscripcionRepository.findByParticipanteAndCompetencia(participante, competencia).isPresent();
        if (yaInscripto) {
            throw new Exception("Ya estás inscripto en esta competencia.");
        }

        // 5. Calcular precio (Lógica de Descuento)
        double precioFinal = competencia.getPrecioBase();
        
        // Buscamos si tiene OTRAS inscripciones en el MISMO torneo
        List<Inscripcion> misInscripciones = inscripcionRepository.findByParticipante(participante);
        boolean tieneOtraEnMismoTorneo = misInscripciones.stream()
                .anyMatch(i -> i.getCompetencia().getTorneo().getIdTorneo().equals(competencia.getTorneo().getIdTorneo()));

        if (tieneOtraEnMismoTorneo) {
            precioFinal = precioFinal * 0.5; // 50% OFF
        }

        // 6. Guardar
        Inscripcion nueva = new Inscripcion();
        nueva.setParticipante(participante);
        nueva.setCompetencia(competencia);
        nueva.setFechaInscripcion(new Date()); // O LocalDate.now() si cambiaste el modelo
        nueva.setPrecioPagado(precioFinal);

        return inscripcionRepository.save(nueva);
    }

    @Override
    public List<Inscripcion> getInscripcionesPorParticipante(Participante participante) {
        return inscripcionRepository.findByParticipante(participante);
    }
}