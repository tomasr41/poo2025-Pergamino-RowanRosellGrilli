package com.ar.edu.unnoba.poo2025.torneos.dto;

public class CompetitionResponseDTO {
    private Integer idCompetencia;
    private String nombre;
    private double precioBase;
    private int cupo;

    // Getters y Setters
    public Integer getIdCompetencia() { return idCompetencia; }
    public void setIdCompetencia(Integer idCompetencia) { this.idCompetencia = idCompetencia; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public double getPrecioBase() { return precioBase; }
    public void setPrecioBase(double precioBase) { this.precioBase = precioBase; }

    public int getCupo() { return cupo; }
    public void setCupo(int cupo) { this.cupo = cupo; }
}