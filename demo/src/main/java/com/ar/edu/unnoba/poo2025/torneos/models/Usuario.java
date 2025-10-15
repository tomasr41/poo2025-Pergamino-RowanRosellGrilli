package com.ar.edu.unnoba.poo2025.torneos.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@Getter
@Setter
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "contraseña", nullable = false, length = 100)
    private String contraseña;

    @Column(name = "rol", nullable = false, length = 20)
    private String rol;
}

