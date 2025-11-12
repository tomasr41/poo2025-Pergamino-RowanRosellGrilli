package com.ar.edu.unnoba.poo2025.torneos.dto;

// Nota: Podrías usar Lombok (@Data) si quisieras, 
// pero la práctica pide explícitamente getters y setters.

public class AuthenticationRequestDTO {

    private String email;
    private String password;

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