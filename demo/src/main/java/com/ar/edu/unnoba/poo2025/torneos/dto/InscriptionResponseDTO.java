package com.ar.edu.unnoba.poo2025.torneos.dto;

import java.util.Date;

public class InscriptionResponseDTO {
    private Long idInscripcion;
    private String nombreTorneo;
    private String nombreCompetencia;
    private Date fechaInscripcion;
    private double precioPagado;

    // Getters y Setters
    public Long getIdInscripcion() { return idInscripcion; }
    public void setIdInscripcion(Long idInscripcion) { this.idInscripcion = idInscripcion; }

    public String getNombreTorneo() { return nombreTorneo; }
    public void setNombreTorneo(String nombreTorneo) { this.nombreTorneo = nombreTorneo; }

    public String getNombreCompetencia() { return nombreCompetencia; }
    public void setNombreCompetencia(String nombreCompetencia) { this.nombreCompetencia = nombreCompetencia; }

    public Date getFechaInscripcion() { return fechaInscripcion; }
    public void setFechaInscripcion(Date fechaInscripcion) { this.fechaInscripcion = fechaInscripcion; }

    public double getPrecioPagado() { return precioPagado; }
    public void setPrecioPagado(double precioPagado) { this.precioPagado = precioPagado; }
}