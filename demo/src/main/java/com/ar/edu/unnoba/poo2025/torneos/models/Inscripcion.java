package com.ar.edu.unnoba.poo2025.torneos.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(
    name = "inscripcion",
    uniqueConstraints = @UniqueConstraint(columnNames = {"id_participante", "id_competencia"})
)
@Getter
@Setter
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inscripcion")
    private Long idInscripcion;

    @Temporal(TemporalType.DATE)
    @Column(name = "fecha_inscripcion", nullable = false)
    private Date fechaInscripcion;

    @Column(name = "precio_pagado", nullable = false)
    private double precioPagado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_participante", nullable = false)
    private Participante participante;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_competencia", nullable = false)
    private Competencia competencia;

    public Inscripcion() {}

    public Inscripcion(Participante participante, Competencia competencia, Date fechaInscripcion, double precioPagado) {
        this.participante = participante;
        this.competencia = competencia;
        this.fechaInscripcion = fechaInscripcion;
        this.precioPagado = precioPagado;
    }

    public double calcularPrecioDescuento() {
        // Ejemplo de descuento (ajustalo según tu lógica)
        return precioPagado * 0.9;
    }
}
