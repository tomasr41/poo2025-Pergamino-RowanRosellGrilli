package com.ar.edu.unnoba.poo2025.torneos.dto;

public class TournamentResponseDTO {
    private Long idTorneo;
    private String nombre;
    private String descripcion;

    public TournamentResponseDTO() {}

    public TournamentResponseDTO(Long idTorneo, String nombre, String descripcion) {
        this.idTorneo = idTorneo;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public Long getIdTorneo() { return idTorneo; }
    public void setIdTorneo(Long idTorneo) { this.idTorneo = idTorneo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
