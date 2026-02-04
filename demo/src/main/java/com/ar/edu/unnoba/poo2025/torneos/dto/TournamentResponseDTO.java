package com.ar.edu.unnoba.poo2025.torneos.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public class TournamentResponseDTO {
    private Long idTorneo;
    private String nombre;
    private String descripcion;
    private boolean publicado;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fechaInicio;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fechaFin;

    public TournamentResponseDTO() {}

    public TournamentResponseDTO(Long idTorneo, String nombre, String descripcion, LocalDate fechaInicio, LocalDate fechaFin, boolean publicado) {
        this.idTorneo = idTorneo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.publicado = publicado;
    }

    public Long getIdTorneo() { return idTorneo; }
    public void setIdTorneo(Long idTorneo) { this.idTorneo = idTorneo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }

    public boolean isPublicado() { return publicado; }
    public void setPublicado(boolean publicado) { this.publicado = publicado; }
}