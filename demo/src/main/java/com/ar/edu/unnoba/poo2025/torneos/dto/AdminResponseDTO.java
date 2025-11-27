package com.ar.edu.unnoba.poo2025.torneos.dto;

public class AdminResponseDTO {
    private Long idUsuario; // Usamos el nombre del atributo en la entidad o mapeamos
    private String email;

    // Getters y Setters
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}