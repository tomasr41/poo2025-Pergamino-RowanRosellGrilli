package com.ar.edu.unnoba.poo2025.torneos.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "competencia")
public class Competencia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_competencia")
    private Integer idCompetencia;
    
    @Column(name = "nombre", nullable = false)
    private String nombre;
    
    @Column(name = "precio_base", nullable = false)
    private double precioBase;
    
    @Min(value = 1, message = "El cupo debe ser mayor que 0")
    @Column(name = "cupo", nullable = false)
    private Integer cupo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_torneo", nullable = false)
    private Torneo torneo;
    
    @OneToMany(mappedBy = "competencia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Inscripcion> inscripciones = new ArrayList<>();

    // Constructor vacío requerido por JPA
    public Competencia() {}
    
    public Competencia(String nombre, double precioBase, Integer cupo, Torneo torneo) {
        this.nombre = nombre;
        this.precioBase = precioBase;
        this.cupo = cupo;
        this.torneo = torneo;
    }
}