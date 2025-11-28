package com.ar.edu.unnoba.poo2025.torneos.dto;

/**
 * DTO para la creación de una cuenta de Administrador.
 * Recibe los datos básicos para registrar un nuevo admin.
 */
public class CreateAdminRequestDTO {
    
    private String email;
    private String password;

    // Constructores
    public CreateAdminRequestDTO() {
    }

    public CreateAdminRequestDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters y Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}