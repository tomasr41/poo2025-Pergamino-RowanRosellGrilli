package com.ar.edu.unnoba.poo2025.torneos.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("ADMIN")
@Getter
@Setter
public class Administrador extends Usuario {

    //no se genera ID porque hereda de Usuario

    @OneToMany(mappedBy = "administrador", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Torneo> torneos = new ArrayList<>();

    // Constructor vacío requerido por JPA
    public Administrador() {}

    // Constructor con argumentos
    public Administrador(String email, String password) {
        super.setEmail(email);
        super.setPassword(password);
    }
}







