package com.ar.edu.unnoba.poo2025.torneos.dto;

public class CreateCompetitionRequestDTO {
    private String name;
    private Integer cupo;
    private Double precioBase; 

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getCupo() { return cupo; }
    public void setCupo(Integer cupo) { this.cupo = cupo; }

    public Double getPrecio() { return precioBase; }
    public void setPrecioBase(Double precio) { this.precioBase = precio; }
}
